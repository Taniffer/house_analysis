import sp from '../baseComponents/spider'
import db from '../mongo/db'

let s=new sp();

(async function () {

    s.setSpider(null,60)
       await s.spider();

    await s.geoCode();
    console.log('操作完成')
})()



// import AddressN from '../modal/addr/addr'
//
//
// (async function () {
//     let houseAddrName = await AddressN.findOne({name: '华贸城'})
//
//
//     console.log(houseAddrName)
// })()