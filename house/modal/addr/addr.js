import mongoose from "mongoose"

const Schema = mongoose.Schema

const addrSchema = new Schema({
    name:{type:String,unique:true},
    code:String,
    price:Number,
    count:Number,
    housesId:[{type:Schema.Types.ObjectId,ref:'houseInfo'}]

},{ timestamps: { createdAt: 'created_at' } })




const address = mongoose.model('addr', addrSchema)

export default address