const router = require('koa-router')()
import Login from '../controller/user/Login'
import body from 'koa-body'

module.exports = router.post('/',body({multipart:true}),Login.loginIn)