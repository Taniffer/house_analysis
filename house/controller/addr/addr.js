import Spider from '../../baseComponents/spider'
import House from '../../modal/house/houseInf'
import Address from '../../modal/addr/addr'

class AddrControl extends Spider {
    constructor(){
        super()
    }

    async getAddrAndCode (ctx,next) {
        let allAddr = await Address.find({},{code:true,count:true,price:true})
        ctx.body = {
            errorCode:0,
            message: '获取token成功',
            code: 1,
            data:allAddr,
        }

    }

}

export default new AddrControl()