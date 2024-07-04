const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const orderController = require('../controller/orderController')

router.get('/', authMiddleware, orderController.allOrdersUser)
router.post('/', authMiddleware, orderController.createOrder)

module.exports = router