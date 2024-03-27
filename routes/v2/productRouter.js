const Router = require('express')
const router = new Router()
const productController = require('../../controller/v2/productController')

router.get('/', productController.allProductData)

module.exports = router