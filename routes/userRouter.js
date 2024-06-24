const Router = require('express')
const router = new Router()
const userController = require('../controller/userController')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/reg', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.auth)
  
module.exports = router