import sp from '../baseComponents/spider'
import db from '../mongo/db'

// let s=new sp();
//
// (async function () {
//
//     s.setSpider(null,60)
//        await s.spider();
//
//     await s.geoCode();
//     console.log('操作完成')
// })()



import AddressN from '../modal/addr/addr'


(async function () {

    let houseAddrName = await AddressN.find().populate('housesId')
    houseAddrName.forEach(async (ele,index)=>{

        // console.log(ele.housesId[0].price)
        ele.price = ele.housesId.reduce((a,b)=>{return a + b.price},0)
        // console.log(houseInf)
        // houseInf.price = houseInf.housesId.reduce((a,b)=>{return a.price + b.price},0)
         await ele.save()
    })


    // console.log(houseAddrName)
    console.log('结束')
})()

