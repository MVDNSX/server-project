const Router = require('express')
const orderController = require('../controller/orderController')
const router = new Router()

router.post('/create', orderController.createOrder)

module.exports = router