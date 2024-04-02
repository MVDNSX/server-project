const Router = require('express')
const router = new Router()
const cartController = require('../../controller/v2/cartController')

router.post('/', cartController.addProductInCart)
router.get('/', cartController.getCart)
router.put('/', cartController.changeQuantityProduct)

module.exports = router

