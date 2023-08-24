const Router = require('express')
const router = new Router()
const dishesController = require('../controller/dishesController')

router.get('/', dishesController.allDishes)
router.post('/create', dishesController.createDish)
router.post('/edit', dishesController.editDish)
router.delete('/:dishId', dishesController.deleteDish)

module.exports = router