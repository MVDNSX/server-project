const Router = require('express')
const router = new Router()
const productController = require('../../controller/v2/productController')

router.get('/', productController.allProductData)
router.post('/', productController.addProduct)
router.put('/', productController.editProduct)
router.post('/category', productController.createCategory)
router.post('/all', productController.createAll)

module.exports = router