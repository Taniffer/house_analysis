import Spider from '../../baseComponents/spider'
import House from '../../modal/house/houseInf'
import Address from '../../modal/addr/addr'

class HouseControl extends Spider {
    constructor(){
        super()
    }

    async upDateHouse (ctx){
       ctx.body = {
           sucess:false,
           message:'this api not available yet',
           data : null,
           code:''
       }
    }

}

export default new HouseControl()