const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const imageRouter = require('./imageRouter')
const orderRouter = require('./orderRouter')
const basketRouter = require('./basketRouter')

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/file', imageRouter)
router.use('/order', orderRouter)
router.use('/basket', basketRouter)

module.exports = router