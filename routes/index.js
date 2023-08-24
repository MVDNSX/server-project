const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const dishesRouter = require('./dishesRouter')

router.use('/user', userRouter)
router.use('/dishes', dishesRouter)

module.exports = router