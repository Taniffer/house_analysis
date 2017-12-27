const Koa = require('koa')
const config=require('./config')
// const loggers = require('koa-logger')
const db = require('./mongo/db')


const routers = require('./router/index')
// import house from './modal/house/houseInf'
//
// let  xx= new house()
// xx.save()
const app = new Koa

// app.use(loggers())

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(config.port)

console.log('the server is started at localhost:8008')
