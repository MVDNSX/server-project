const Router = require('express')
const router = new Router()
const userController = require('../controller/userController')

router.get('/auth', userController.auth)
router.post('/reg', userController.registration)
router.post('/login', userController.login)
  
module.exports = router