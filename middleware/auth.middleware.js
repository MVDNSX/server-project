const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS'){
    next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
      return res.status(401).json({message: 'Ошибка аутентификации'})
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decode
    next()
  } catch (error) {
    console.log(error)
    res.status(400).json({message: 'Ошибка сервера'})
  }
}