

const mongodb=require('../mongo/connect');
// const mysql =require('mysql');
const mysql = require('promise-mysql');
// var mysql = require('mysql');


mongodb.init('mongodb://localhost:27017/houseAnalysis');
// let con = mysql.createConnection({
//     host: "localhost",
//     user: "xiaohei",
//     password: "xiaohei947",
//     database:'testdb'
// });

let transformData = [];

// mongodb.find('locationAndCode',{}, {_id: false,count:false}).then(res => {
//
//     console.log('获取数据成功', res.length);
//     addrData=res.map(ele=>{
//         return [ele.addr,ele.location]
//     })
//     console.log(addrData);
//
//     con.connect(function(err) {
//         if (err) throw err;
//         let sql = "INSERT INTO address (addr_name, addr_loc) VALUES ?";
//         let values = addrData;
//
//         con.query(sql, [values], function (err, result) {
//             if (err) throw err;
//             console.log("Number of records inserted: " + result.affectedRows);
//         });
//
//         console.log("Connected!");
//     });
//
//
//
// });



// mongodb.find('houseInfo',{}, {img:false}).then(res => {
//
//     console.log('获取数据成功', res.length);
//     transformData=res.map(ele=>{
//         return [ele._id,ele.title,ele.href,ele.addr,ele.price,ele.meters,ele.zone]
//     })
//     console.log(transformData);
//
//     con.connect(function(err) {
//         if (err) throw err;
//         let sql = "INSERT ignore INTO houseinfo (house_id,house_title,house_href,house_aname,house_price,house_area,house_zone) VALUES ?";
//         let values = transformData;
//
//         con.query(sql, [values], function (err, result) {
//             if (err) throw err;
//             console.log("Number of records inserted: " + result.affectedRows);
//         });
//
//
//         console.log("Connected!");
//     });
//
//
//
// });



// mongodb.find('houseInfo',{}, {}).then(res => {
//
//     console.log('获取数据成功', res.length);
//     transformData=res.map(ele=>{
//         return [ele._id,ele.img]
//     })
//     console.log(transformData);
//
//     con.connect(function(err) {
//         if (err) throw err;
//         let sql = "INSERT ignore INTO img (img_house,img_href) VALUES ?";
//         let values = transformData;
//
//         con.query(sql, [values], function (err, result) {
//             if (err) throw err;
//             console.log("Number of records inserted: " + result.affectedRows);
//         });
//
//
//         console.log("Connected!");
//     });
//
//
//
// });


pool = mysql.createPool({
    host: 'localhost',
    user: 'xiaohei',
    password: 'xiaohei947',
    database: 'testdb',
    connectionLimit: 10
});


(function () {
    var sql='insert into testdb.houseinfo (house_id,house_title)';

pool.query('select `name` from hobbits').then(function(rows){
    // Logs out a list of hobbits
console.log(rows);
});
})();
