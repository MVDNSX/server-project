const Router = require('express')
const router = new Router()

const userRouter = require('./v2/userRouter')
router.use('/user', userRouter)

const renderRouter = require('./v2/renderRouter')
router.use('/render', renderRouter)

const productRouter = require('./v2/productRouter')
router.use('/product', productRouter)

const cartRouter = require('./v2/cartRouter')
router.use('/cart', cartRouter)


//const imageRouter = require('./imageRouter')
//router.use('/file', imageRouter)

//const orderRouter = require('./orderRouter')
//router.use('/order', orderRouter)

module.exports = router