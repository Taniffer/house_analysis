import async from 'async'
import superagent from 'superagent'
import BaseCop from './baseComponent'
import cheerio from 'cheerio'


import House from '../modal/house/houseInf'
import Address from '../modal/addr/addr'

/*
*
* 公有方法，可供子类使用的 spider() ,setSpider(baseUrl,n)
* @param:baseUrl:基础URL
* @param:n ：爬虫数量,也就是要爬的页数
* */

export default class Spider extends BaseCop{

    constructor(){
        super()
        this.baseUrl = 'https://bj.lianjia.com/zufang/pg'
        this.n= 5
        this.urlArray = []
        this.items = []
        this.concurrencyCount = 0;

    }



    getUrlArray () {
         for (let i = 0; i < this.n; i++) {
             this.urlArray.push(this.baseUrl + (i + 1));
         }
     }

    fetchUrl   (url, callback) {
            let self = this
            // delay 的值在 2000 以内，是个随机的整数
            let delay = parseInt((Math.random() * 10000) % 2000, 10);
            this.concurrencyCount++;
            console.log('现在的并发数是', this.concurrencyCount, '，正在抓取的是',',耗时' + delay + '毫秒');
            superagent.get(url).end((err, sres) => {
                if(err) callback(err)
                try {
                    if (err) throw (err);
                    setTimeout(function () {
                        self.concurrencyCount--;
                        callback(null, sres.text);
                    }, delay);
                } catch (err) {
                    console.log(err);
                    callback(err)
                }
            });
        }

    async geoCode () {
        let addressCode = [],
            urlArray = [],

            aMapApi = 'http://restapi.amap.com/v3/geocode/geo?key=e6753f55029433c997daa7e0fa752c00&batch=true&address=';

         /*
         * abItems 用来存储数据库中获取到的地址数据
         * */
         let dbItems = [];

         await Address.find({code: {$exists: false}})
             .then((res)=>{
                 console.log('准备处理无编码的数据，数据长度为',res.length)
                 dbItems = res
             })
        //数据长度不为零，开始处理
         if(dbItems.length> 0 ){
             for (let i = 0; i < dbItems.length; i += 10) {
                 let newItems = dbItems.slice(i, i + 10).reduce(function (a, b) {
                     return a + '|' + '北京市' + b.name.trim()
                 }, '').slice(1);
                 // console.log(newItems);
                 urlArray.push(encodeURI(aMapApi + newItems));
             }

             let asyncPromise = this.promisify(async.mapLimit, async),
                 asyncEachPromise = this.promisify(async.eachOf,async),
                 successUpdateCount = 0

             await asyncPromise(urlArray, 5, (url, callback) => {
                 this.fetchUrl(url, callback)
             }).then(res => {
                 res.forEach((ele, index) => {
                     JSON.parse(ele).geocodes.forEach((elein, indexin) => {
                         addressCode[(index * 10 + indexin)] = elein.location;

                     })
                 })
             }).catch(e=>{console.log('调用高德api时出现错误')})

        await asyncEachPromise(dbItems,async(ele,index,callback)=>{
                 try {
                     ele.code =  addressCode[index]
                     await ele.save()
                     successUpdateCount++;
                     callback()

                 }catch (e){
                     callback(e)
                 }
             }).then((res)=>{
                 console.log('已成功更新的次数为',successUpdateCount)
             }).catch((err)=>{console.log('解析转储时出现了错误',err)})
         }
         else{
             console.log('没有需要处理的数据，转码结束')
         }


    }

    setSpider(baseUrl,n){
        this.baseUrl = baseUrl || this.baseUrl
        this.n= n || this.n
    }

    async spider () {
        let  self = this

        this.getUrlArray()

        let asyncPromise = this.promisify(async.mapLimit, async),
            asyncEachPromise = this.promisify(async.mapSeries,async)

        await asyncPromise(this.urlArray, 5, function (url, callback) {
                self.fetchUrl(url, callback);
            }).then( async(result) => {
                console.log('final:');

                result.forEach((ele) => {
                    let $ = cheerio.load(ele);


                    $('.house-lst ').children('li').each(async (index, ele) => {
                        let $title = $(ele).children('.info-panel').children('h2 ').children(' a'),
                            $id = $(ele),
                            $price = $(ele).children('.info-panel').find('.price').find('.num'),
                            $meters = $(ele).children('.info-panel').find('.meters'),
                            $zone = $(ele).children('.info-panel').find('.zone'),
                            $addr = $(ele).children('.info-panel').children('.col-1').children('.where').children(' a ').children('span'),
                            $img = $(ele).children('.pic-panel').find(' img ').attr('data-img'),
                            imgArr = $img.split('/');


                        this.items.push({
                            id: $id.attr('data-id'),
                            title: $title.attr('title'),
                            href: $title.attr('href'),
                            addr: $addr.text().replace(/\s+/,''),
                            price: $price.text()+1,
                            meters: $meters.text(),
                            zone: $zone.text(),
                            img: imgArr[imgArr.length - 1],
                        });

                    });
                })


                let  repeatItemsCount = 0;
                let needSaveCount  = 0 ;
                // await mongodb.insert('houseInfo',items);
                // try {
             await asyncEachPromise(this.items,async(ele,callback)=>{
                        let houseInf = await House.find({id:ele.id})
                        if (houseInf.length>0){
                            //这个房子已经存在，已找到相关项
                            repeatItemsCount++
                            // console.log('房子已存在')
                        }else{
                            //房子不存在，需要储存
                            needSaveCount ++
                            let newHouse = new House({
                                id: ele.id,
                                title: ele.title,
                                href: ele.href,
                                addr: ele.addr,
                                price: ele.price,
                                meters: ele.meters,
                                zone: ele.zone,
                                img: ele.img
                            })
                            //寻找相同地址下有没有房子
                            let houseAddrName =  await Address.findOne({name:newHouse.addr})

                            // console.log(houseAddrName)
                            //没有这个地址，新建地址
                            if (!houseAddrName){
                                let newAddr = new Address({
                                    name:newHouse.addr,
                                    count:1
                                })
                                newAddr.housesId.push(newHouse._id)
                                newHouse.addrId = newAddr._id
                                newAddr.price = newHouse.price

                                await newHouse.save()
                                await newAddr.save()
                            }else {
                                //有这个地址，在原油地址上改动
                                houseAddrName.count++
                                houseAddrName.housesId.push(newHouse._id)
                                houseAddrName.price += newHouse.price
                                newHouse.addrId = houseAddrName._id

                                await newHouse.save()
                                await houseAddrName.save()



                            }
                            console.log('房子已经储存 栋数为',needSaveCount)

                        }
                        callback(null,'re')

                    }).then((res)=>{
                        // if(err) console.log('errrr')
                        console.log('重复的栋数为',repeatItemsCount)
                    })

                // }catch (e){
                //     console.log('储存houseInf时出错')
                //
                // }
            })
    }

}
