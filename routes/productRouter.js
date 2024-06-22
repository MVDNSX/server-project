const Router = require('express')
const router = new Router()
const productController = require('../controller/productController')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/', productController.allProduct)
router.post('/upload', productController.pictureUpload)
router.post('/create', productController.createProduct)
router.put('/edit', productController.editProduct)
router.delete('/:productId', productController.deleteProduct)
router.post('/category', productController.createCategory)
router.post('/all', productController.createAll)

module.exports = router