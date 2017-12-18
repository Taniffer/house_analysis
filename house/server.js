var http = require("http"),
    url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    express = require('express'),
    eventproxy = require('eventproxy'),
    request = require('request'),
    mysql = require('promise-mysql'),
    download = require('download');


let app = express(),
    items = [],
    ep = new eventproxy(),
    pool = mysql.createPool({
        host: 'localhost',
        user: 'sauron',
        password: 'theonetruering',
        database: 'mordor',
        connectionLimit: 10
    }),
    mongodb = require('./mongo/connect');


mongodb.init('mongodb://localhost:27017/houseAnalysis');

const getUrlArray = (baseUrl, n, urlArray) => {
    for (var i = 0; i < n; i++) {
        urlArray.push(baseUrl + (i + 1));
    }
};


let fetchUrl = (function () {
    var concurrencyCount = 0;

    var fetchUrl = function (url, callback) {

        // delay 的值在 2000 以内，是个随机的整数
        var delay = parseInt((Math.random() * 10000) % 2000, 10);
        concurrencyCount++;
        console.log('现在的并发数是', concurrencyCount, '，正在抓取的是',',耗时' + delay + '毫秒');
        // console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');

        superagent.get(url).end((err, sres) => {
            try {
                if (err) throw (err);
                // console.log('fetch'+url+'sucessful');
                // ep.emit('getHouseData', sres.text)


                setTimeout(function () {
                    concurrencyCount--;
                    callback(null, sres.text);
                }, delay);

            } catch (err) {

                console.log(err);
            }
        });
    };
    return fetchUrl;
})();

let promisify = (fn, receiver) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn.apply(receiver, [...args, (err, res) => {
                return err ? reject(err) : resolve(res);
            }]);
        });
    };
};

const processDataOrg = async () => {

    var dbItems = [];
    var addrAndPosition = [];
    // mongodb.insert('houseInfo',items);
    await mongodb.find('houseInfo', {proc: false}, {_id: false}).then(res => {
        dbItems = res;
        console.log('获取爬虫数据完成')
    });
    await mongodb.update('houseInfo', {proc: false}, {$set: {proc: true}})

    var obj = {}
    dbItems.forEach((ele) => {
        var addr = ele.addr.trim();
        if (!obj[addr]) {
            obj[addr] = 1;
        } else {
            obj[addr]++;
        }
    });

    for (var key in obj) {
        addrAndPosition.push({addr: key, count: obj[key], withCode: false});
    }
    console.log('处理爬虫数据完成，去重后数据长度为', addrAndPosition.length);
    if (addrAndPosition.length > 0) {
        await mongodb.insert('location', addrAndPosition);
    }

};

let downloadPic = async () => {

    let num=0,
        houseInfo = [],
        urlList = [],
        basePicURL = ' https://image1.ljcdn.com/110000-inspection/';

    await mongodb.find('houseInfo', {withpic: false}).then(res => {
        houseInfo = res
    });
    await mongodb.update('houseInfo', {withpic: false}, {$set: {withpic: true}});

    houseInfo.forEach((ele) => {
        urlList.push(basePicURL + ele.img);
    });

    console.log('需要更新的图片数量为', urlList.length);


    let asyncPrm = promisify(async.mapLimit, async);
    await  asyncPrm(urlList, 5, (url, callback) => {
        download(url, './public/img').then((res) => {
            console.log('done!',++num);

            setTimeout(function () {

                callback(null, url);
            }, 100);

        }).catch(err=>{console.log(err);callback(null,url)})

    }).then(res=>{console.log('操作结束')});
};

const geoCode = async () => {
    let addressCode = [],
        urlArray = [],

        aMapApi = 'http://restapi.amap.com/v3/geocode/geo?key=e6753f55029433c997daa7e0fa752c00&batch=true&address=';


    await  mongodb.find('location', {withCode: false}, {_id: false}).then(res => {
        addressCode = res;
        console.log('获取去重数据成功，数据长度为', addressCode.length)
    });


    await  mongodb.update('location', {withCode: false}, {$set: {withCode: true}});

    for (let i = 0; i < addressCode.length; i += 10) {

        let newItems = addressCode.slice(i, i + 10).reduce(function (a, b) {
            return a + '|' + '北京市' + b.addr.trim()
        }, '').slice(1);
        // console.log(newItems);

        urlArray.push(encodeURI(aMapApi + newItems));


    }

    let asyncPromise = promisify(async.mapLimit, async);
    await asyncPromise(urlArray, 5, (url, callback) => {
        fetchUrl(url, callback)
    }).then(res => {
        res.forEach((ele, index) => {
            JSON.parse(ele).geocodes.forEach((elein, indexin) => {
                addressCode[(index * 10 + indexin)].location = elein.location;
                addressCode[(index * 10 + indexin)].withCode = true;
            })
        })
    })

    if (addressCode.length > 0) {
        let cot = 0;
        let p = [];
        addressCode.forEach((ele, index) => {
            p[index] = mongodb.update('locationAndCode', {addr: ele.addr}, {$inc: {count: ele.count},$set:{location:ele.location}}, {upsert: true}).then(res => {
                cot++;
            }, err => {
                console.log(err)
            });
        })

        await Promise.all(p);
        console.log('更新成功次数为', cot);

    } else {
        console.log('未增加新的数据')
    }


};


const spider = (urlArray) => {
    return new Promise(resolve => {
        async.mapLimit(urlArray, 5, function (url, callback) {
            fetchUrl(url, callback);
        }, async (err, result) => {
            console.log('final:');

            result.forEach((ele) => {
                var $ = cheerio.load(ele);


                $('.house-lst ').children('li').each(async (index, ele) => {
                    let $title = $(ele).children('.info-panel').children('h2 ').children(' a'),
                        $id = $(ele);
                    $price = $(ele).children('.info-panel').find('.price').find('.num'),
                        $meters = $(ele).children('.info-panel').find('.meters'),
                        $zone = $(ele).children('.info-panel').find('.zone'),
                        $addr = $(ele).children('.info-panel').children('.col-1').children('.where').children(' a ').children('span'),
                        $img = $(ele).children('.pic-panel').find(' img ').attr('data-img'),
                        imgArr = $img.split('/');


                    items.push({
                        _id: $id.attr('data-id'),
                        title: $title.attr('title'),
                        href: $title.attr('href'),
                        addr: $addr.text(),
                        price: $price.text(),
                        meters: $meters.text(),
                        zone: $zone.text(),
                        img: imgArr[imgArr.length - 1],
                        withpic: false,
                        proc: false,
                    });

                });
            })

            // await mongodb.insert('houseInfo',items);
            await mongodb.insert('houseInfo', items, {ordered: false}).catch(err => {
                console.log('失败的条目为', err.writeErrors.length)
            });


            resolve();

        })
    })
}

let init = async (n) => {


    // let p1 = mongodb.remove('houseInfo', {});
    // let p2 = mongodb.remove('location', {});
    // let p3 = mongodb.remove('locationAndCode', {});
    //
    // await Promise.all([p1, p2, p3])
    // console.log(2);

    var urlArray = [];
    getUrlArray('https://bj.lianjia.com/zufang/pg', n, urlArray);

    await spider(urlArray);

    await processDataOrg();

    await geoCode();

    await downloadPic();


};


const test = async (n) => {

    var urlArray = [];
    getUrlArray('https://bj.lianjia.com/zufang/pg', n, urlArray);

    await spider(urlArray);

};

const start = () => {

    app.get('/house', function (req, res) {

        var newItemLocation = [];
        mongodb.find('locationAndCode', {}, {_id: false}).then(resp => {
            resp.forEach((ele, index) => {


                let count = ele.count;
                let location = ele.location;
                let latAndLng = location.split(',');
                newItemLocation.push({
                    lng: latAndLng[0],
                    lat: latAndLng[1],
                    count: count
                })
            })


            res.send(newItemLocation);

        });
    });


    app.listen(8008, function () {
        console.log('app is listening at port 8008');
    });
};




exports.init = init;
exports.start = start;
exports.test = test;

