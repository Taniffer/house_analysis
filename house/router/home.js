const router = require('koa-router')()

import Home from '../controller/home/home'



module.exports = router.get('/',Home.getHomePage)