const Router = require('express')
const router = new Router()
const cartController = require('../../controller/v2/cartController')

router.post('/add', cartController.addProductCart)
router.get('/', cartController.getCart)

module.exports = router

