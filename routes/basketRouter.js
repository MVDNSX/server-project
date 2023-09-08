const Router = require('express')
const basketController = require('../controller/basketController')
const authMiddleware = require('../middleware/auth.middleware')
const router = new Router()

router.get('/',authMiddleware, basketController.getItemsBasket)
//router.get('/:productId',basketController.getOneItemBasket)
router.post('/add', authMiddleware, basketController.addItemBasket)
router.put('/comment',authMiddleware, basketController.changeItemComment)
router.put('/count',authMiddleware, basketController.changeItemCount)
router.delete('/:productId',authMiddleware, basketController.deleteItemBasket)

module.exports = router