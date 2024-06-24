const Router = require('express')
const router = new Router()
const cartController = require('../controller/cartController')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/', authMiddleware, cartController.getCart)
router.post('/', authMiddleware, cartController.addProductInCart)
router.post('/clear', authMiddleware, cartController.clearCart)

module.exports = router

