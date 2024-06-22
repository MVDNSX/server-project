const Router = require('express')
const router = new Router()

const productRouter = require('./v2/productRouter')
router.use('/product', productRouter)

const cartRouter = require('./v2/cartRouter')
router.use('/cart', cartRouter)


const userRouter = require('./userRouter')
const imageRouter = require('./imageRouter')
const orderRouter = require('./orderRouter')


//const productRouter = require('./productRouter')
//router.use('/product', productRouter)
//const basketRouter = require('./basketRouter')
//router.use('/basket', basketRouter)

router.use('/user', userRouter)
router.use('/file', imageRouter)
router.use('/order', orderRouter)

module.exports = router