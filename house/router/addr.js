const router = require('koa-router')()
import AddrControl from '../controller/addr/addr'



module.exports = router.get('/getCode',AddrControl.getAddrAndCode)