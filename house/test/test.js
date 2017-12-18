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


// var Schema = mongoose.Schema;
//
// var personSchema = Schema({
//     _id: Schema.Types.ObjectId,
//     name: String,
//     age: Number,
//     stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
// });
//
// var storySchema = Schema({
//     author: { type: Schema.Types.ObjectId, ref: 'Person' },
//     title: String,
//     fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
// });
//
// var Story = mongoose.model('Story', storySchema);
// var Person = mongoose.model('Person', personSchema);
//
// var author = new Person({
//     _id: new mongoose.Types.ObjectId(),
//     name: 'Ian Fleming',
//     age: 50
// });
//
// author.age=49
//
// author.save(function (err) {
//     if (err) return handleError(err);
//
//     var story1 = new Story({
//         title: 'Casino Royale',
//         author: author._id    // assign the _id from the person
//     });
//
//
//     story1.save(function (err) {
//         if (err) return handleError(err);
//         // thats it!
//         author.stories.push(story1._id);
//         author.save();
//         console.log(story1._id,author._id)
//         console.log('xxx')
//     });
// });
//
// var kittySchema = mongoose.Schema({
//     name: String
// });


// kittySchema.methods.speak = function () {
//     var greeting = this.name
//         ? "Meow name is " + this.name
//         : "I don't have a name";
//     console.log(greeting);
// }
//
// var Kitten = mongoose.model('Kitten', kittySchema);
//
// var fluffy = new Kitten({ name: 'fluffy' });
// fluffy.speak(); // "Meow name is fluffy"
//
//
// fluffy.save(function (err, fluffy) {
//     if (err) return console.error(err);
//     fluffy.speak();
// });
// Kitten.find(function (err, kittens) {
//     if (err) return console.error(err);
//     console.log(kittens);
// })


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/houseAnalysis', { useMongoClient: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('sucess')
});


 var Schema = mongoose.Schema;

let adrSchema = Schema({
    name:String,
    loc:String,
    count:Number,
    houses:[{type:Schema.Types.ObjectId,ref:'adr'}],
});



let houseSchema = Schema({

    title: String,
    href:String,
    addr:{type:Schema.Types.ObjectId,ref:'house'}
});



var adr = mongoose.model('adr', adrSchema);
var house = mongoose.model('house', houseSchema);



// let hou = new house;

let data = {
    title:'是打发',
    href:'sdfaf',
    addr:'华贸城'
},
    data1=[{
        name:'华贸城',
        loc:'115.1116'
    }]

let xiaoqu=new adr({
    name:data.addr,
    count:0,
});



adr.find({'name':xiaoqu.name})
    .then((res)=>{

             // console.log(err)
             // console.log('发生错误')
        if(res.length===0) {
            console.log('储存')
            xiaoqu.save()
                .then(res => {
                    let hou = new house({
                        title: data.title,
                        href: data.href,
                        addr: xiaoqu._id,
                    });

                    hou.save( res => {

                        xiaoqu.houses.push(hou._id)
                        xiaoqu.save(res => {
                        });
                    })


                })
        }else {

            res[0].count++;
            res[0].save(res=>{})
            console.log('ssu')
            console.log(res)
        }
    })

// xiaoqu.save(function (err,res) {
//     console.log(2)
// })

                // let hou = new house({
                //     title:data.title,
                //     href:data.href,
                //
                // });
                //
                // hou.save(function (err,res) {
                //
                // })