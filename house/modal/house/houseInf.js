
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const houseInfoSchema = new Schema({
    title:String,
    href:String,
    addr:String,
    id:{type:String,unique:true},
    price:Number,
    meters:String,
    zone:String,
    img:String,
    addrId:{type:Schema.Types.ObjectId,ref:'addr'}

},{ timestamps: { createdAt: 'created_at' } })

houseInfoSchema.statics.addHouse=()=>{

}


const house = mongoose.model('houseInfo', houseInfoSchema)

export default house


