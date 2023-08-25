const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const dishesRouter = require('./dishesRouter')
const imageRouter = require('./imageRouter')

router.use('/user', userRouter)
router.use('/dishes', dishesRouter)
router.use('/file', imageRouter)

module.exports = router