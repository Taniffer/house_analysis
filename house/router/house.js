const router = require('koa-router')()
import HouseControl from '../controller/house/house'


module.exports = router.get('/updateHouse',HouseControl.upDateHouse)