import Spider from '../../baseComponents/spider'
import House from '../../modal/house/houseInf'
import Address from '../../modal/addr/addr'

class AddrControl extends Spider {
    constructor(){
        super()
    }

    async getAddrAndCode (ctx,next) {
        let allAddr = await Address.find({},{name:true,code:true,count:true})
        ctx.body=allAddr
    }

}

export default new AddrControl()