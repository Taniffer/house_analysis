// var download=require('download');
// var async=require('async');
// let promisify=require('util').promisify;
//
// let fs=require('fs');
//
//
// const urlList = [
//     "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg",
//     "http://content.battlenet.com.cn/wow/media/wallpapers/patch/black-temple/black-temple-1920x1200.jpg",
//     "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg",
//     "http://content.battlenet.com.cn/wow/media/wallpapers/patch/rage-of-the-firelands/rage-of-the-firelands-1920x1200.jpg",
//     "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fury-of-hellfire/fury-of-hellfire-3840x2160.jpg",
// ];
//
//
//
//download('http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg', './public/img').then(() => {
  //  console.log('done!');
//});



// var count=0
//
// async.mapLimit(urlList,3,(url,callback)=>{
//     count++;
//     console.log('并发数',count);
//     download(url, './public/img').then(() => {
//         console.log('done!');
//
//         setTimeout(function () {
//
//             count--;
//             callback(null,url);
//         },100);
//
//     })
//
//
// },function (res) {
//
// });

// fs.writeFile('message.txt', 'Hello Node.js', (err) => {
//     if (err) {
//         if (err.code === 'EEXIST') {
//             console.error('myfile already exists');
//             return;
//         }
//
//         throw err;
//     }
//     console.log('The file has been saved!');
// });
//
//
// fs.access('mesage.txt', fs.constants.R_OK | fs.constants.W_OK, (err) => {
//     console.log(err ? 'no access!' : 'can read/write');
// })


