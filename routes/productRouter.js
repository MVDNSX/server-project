const Router = require('express')
const router = new Router()
const productController = require('../controller/productController')

router.get('/', productController.allProductData)
router.post('/', productController.addProduct)
router.put('/', productController.editProduct)

module.exports = router