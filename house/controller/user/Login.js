// import Spider from "../../baseComponents/spider"
const jwt = require('jsonwebtoken')
// const jwtKoa = require('koa-jwt')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
import User from '../../modal/user/user'
const secret = 'jwt demo'


class Login  {


    async loginIn (ctx){


        const fieldData = ctx.request.body
        console.log(fieldData)

        if(fieldData && fieldData.fields && fieldData.fields.userName || (fieldData && fieldData.userName)) {

            let userName = fieldData.userName || fieldData.fields.userName
            let password = fieldData.password || fieldData.fields.password
            let findUser = await User.findOne({name:userName,password})

            if(findUser && findUser.name){


                let userToken = {
                    userName:userName
                }
                const token = jwt.sign(userToken, secret, {expiresIn: '1h'})  //token签名 有效期为1小时
                ctx.body = {
                    errorCode:0,
                    message: '获取token成功',
                    token
                }
            }
            else{
                ctx.body = {
                    errorCode:10001,
                    message: '用户不存在或者密码错误',
                }
            }
        } else {
            ctx.body = {
                errorCode:10002,
                message: '参数错误',
            }
        }

    }

}

export default new Login()