const Router = require('express')
const basketController = require('../controller/basketController')
const authMiddleware = require('../middleware/auth.middleware')
const router = new Router()

router.get('/',authMiddleware, basketController.getItemsBasket)
router.post('/add', basketController.addItemBasket)
router.put('/comment', basketController.changeItemComment)
router.put('/count', basketController.changeItemCount)
router.delete('/:dishId', basketController.deleteItemBasket)

module.exports = router