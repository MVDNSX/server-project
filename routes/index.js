const Router = require('express')
const router = new Router()

const productRouter = require('./v2/productRouter')
router.use('/product', productRouter)

const cartRouter = require('./v2/cartRouter')
router.use('/cart', cartRouter)


//const userRouter = require('./userRouter')
//const productRouter = require('./productRouter')
//const imageRouter = require('./imageRouter')
//const orderRouter = require('./orderRouter')
//const basketRouter = require('./basketRouter')

//router.use('/user', userRouter)
//router.use('/product', productRouter)
//router.use('/file', imageRouter)
//router.use('/order', orderRouter)
//router.use('/basket', basketRouter)

module.exports = router