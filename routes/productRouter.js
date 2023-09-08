const Router = require('express')
const router = new Router()
const productController = require('../controller/productController')

router.get('/', productController.allProduct)
router.post('/create', productController.createProduct)
router.post('/edit', productController.editProduct)
router.delete('/:productId', productController.deleteProduct)

module.exports = router