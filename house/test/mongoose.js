let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/houseAnalysis', { useMongoClient: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('we\'re connected!')
});


let Schema = mongoose.Schema;

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