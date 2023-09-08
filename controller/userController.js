const {User, Basket} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
   async auth(req, res) {
      try {
         const user = await User.findOne({where: {id: req.user.id}, include:{model: Basket, attributes:['basketId']}})
         const token = jwt.sign({id: user.id, email: user.email, basketId: user.basket.basketId}, process.env.SECRET_KEY, {expiresIn: '1h'})
         return res.status(200).json({
            token,
            user:{
               id:user.id,
               email: user.email,
               avatar: user.avatar,
               basketId: user.basket.basketId
            }
         })
      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка сервера'})
      }
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
         const basket = await Basket.create({userId: user.id}) // создание привязки корзины к пользователю
         res.status(200).json({
            user:{
               id:user.id,
               email: user.email,
               avatar: user.avatar,
               basketId: basket.basketId
            }
         })

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
         
         const basket = await user.getBasket() //

         const token = jwt.sign({id: user.id, email: user.email, basketId: basket.basketId}, process.env.SECRET_KEY, {expiresIn: '1h'}) //создание токена

         return res.status(200).json({
            token,
            user:{
               id:user.id,
               email: user.email,
               avatar: user.avatar,
               basketId: basket.basketId
            }
         })

         
      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка сервера'})
      }
   }
   
}

module.exports = new UserController()