const Router = require('express')
const router = new Router()
const productController = require('../controller/productController')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/', productController.allProduct)
router.post('/upload', productController.pictureUpload)
router.post('/create', authMiddleware, productController.createProduct)
router.put('/edit', authMiddleware, productController.editProduct)
router.delete('/:productId', authMiddleware, productController.deleteProduct)

module.exports = router