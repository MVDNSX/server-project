const Router = require('express')
const renderController = require('../controller/v2/renderController')

const router = new Router()


router.post('/addcategory', renderController.addAllCategories)
router.post('/addproduct', renderController.addAllProducts)


module.exports = router