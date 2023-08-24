const {User} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
   async auth(req, res) {
    
   }

   async registration(req, res){
      try {
         const {email, password} = req.body //деструктуризируем тело запроса и получаем поля
         const candidate = await User.findOne({where:{email}}) //проверка существования пользователя с таким email

         if(candidate) {
           return res.status(400).json({message: `Пользователь с email ${email} уже существует`})
         }

         const hashPassword = await bcrypt.hash(password, 10) //если такого пользователя нет хэшируем пароль
         const user = await User.create({email, password:hashPassword}) //записываем пользователя в базу
         res.status(200).json(user)

      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка сервера'})
      }
   }

   async login(req, res){
      try {
         const {email, password} = req.body //деструктуризируем тело запроса и получаем поля
         
         const user = await User.findOne({where: {email}}) //поиск пользователя в бд
         if(!user){
           return res.status(400).json({message: 'Пользователь не найдет'})
         }

         const validatePassword = bcrypt.compareSync(password, user.password) // проверка валидности пароля
         if(!validatePassword){
           return res.status(400).json({message: 'Не верные данные пользователя'})
         }

         const token = jwt.sign({id: user.id, email: user.email}, process.env.SECRET_KEY, {expiresIn: '1h'}) //создание токена

         res.status(200).json({
            token,
            user:{
               id:user.id,
               email: user.email
            }
         })

         
      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка сервера'})
      }
   }
   
}

module.exports = new UserController()