const Router = require('express')
const router = new Router()
const userController = require('../controller/userController')

router.get('/auth', userController.check)
router.post('/reg', userController.registration)
router.post('/login')
  
module.exports = router