const router = require('koa-router')()


const consoleTest = require('./console')

router.use('/',consoleTest.routes(),consoleTest.allowedMethods())

module.exports = router