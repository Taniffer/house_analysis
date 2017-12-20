const router = require('koa-router')()


import Addr from './addr'
import House from './house'

router.use('/api/house',House.routes(),House.allowedMethods())
router.use('/api/addr',Addr.routes(),Addr.allowedMethods())

module.exports = router