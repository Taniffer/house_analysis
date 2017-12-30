import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserInfoSchema = new Schema({
    name:String,
    password:String,
    valid:{type:Boolean,default:true}
},{ timestamps: { createdAt: 'created_at' } })

// houseInfoSchema.statics.addHouse=()=>{
//
// }


let User = mongoose.model('user', UserInfoSchema)

export default User