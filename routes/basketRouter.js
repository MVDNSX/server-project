const Router = require('express')
const basketController = require('../controller/basketController')
const router = new Router()

router.post('/add', basketController.addDish)
router.put('/comment', basketController.changeComment)
router.put('/count', basketController.changeCount)
router.delete('/', basketController.deleteDish)

module.exports = router