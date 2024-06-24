const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
router.use('/user', userRouter)

const renderRouter = require('./renderRouter')
router.use('/render', renderRouter)

const productRouter = require('./productRouter')
router.use('/product', productRouter)

const cartRouter = require('./cartRouter')
router.use('/cart', cartRouter)


//const imageRouter = require('./imageRouter')
//router.use('/file', imageRouter)

//const orderRouter = require('./orderRouter')
//router.use('/order', orderRouter)

module.exports = router