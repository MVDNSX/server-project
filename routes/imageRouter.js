const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const imgController = require('../controller/imgController')

router.post('/avatar', authMiddleware, imgController.loadAvatar)


module.exports = router