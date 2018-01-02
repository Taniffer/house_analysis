const Koa = require('koa')
const config=require('./config')
// const loggers = require('koa-logger')
const db = require('./mongo/db')
// const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'

const routers = require('./router/index')
// import house from './modal/house/houseInf'
//
// let  xx= new house()
// xx.save()
const app = new Koa

// app.use(bodyParser())


// app.use(loggers())

app.use(jwtKoa({secret}).unless({
        path: [/^\/api\/login/] //数组中的路径不需要通过jwt验证
    }))

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(config.port)

console.log('the server is started at localhost:8008')
