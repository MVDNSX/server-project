const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const dishesRouter = require('./dishesRouter')
const imageRouter = require('./imageRouter')
const orderRouter = require('./orderRouter')
const basketRouter = require('./basketRouter')

router.use('/user', userRouter)
router.use('/dishes', dishesRouter)
router.use('/file', imageRouter)
router.use('/order', orderRouter)
router.use('/basket', basketRouter)

module.exports = router