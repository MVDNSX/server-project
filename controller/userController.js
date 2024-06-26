const {User, Cart} = require('../models/modelsV2')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {

   async registration(req, res){
      try {
         const {email, password} = req.body //деструктуризируем тело запроса и получаем поля
         const candidate = await User.findOne({where:{email}}) //проверка существования пользователя с таким email

         if(candidate) {
           return res.status(400).json({message: `Пользователь с таким email уже существует`})
         }

         const hashPassword = await bcrypt.hash(password, 10) //если такого пользователя нет хэшируем пароль
         const user = await User.create({email, password:hashPassword}) //записываем пользователя в базу
         const cart = await Cart.create({userId: user.id}) // создание привязки корзины к пользователю
         res.status(200).json({
            user:{
               id:user.id,
               email: user.email,
               avatar: user.avatar,
               cartId: cart.id
            },
            message:'Регистрация прошла успешно!'
         })

      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка регистрации'})
      }
   }


   async login(req, res){
      try {
         const {email, password} = req.body //деструктуризируем тело запроса и получаем поля
         
         const user = await User.findOne({where: {email}}) //поиск пользователя в бд
         if(!user){
           return res.status(400).json({message: 'Не верные данные пользователя'})
         }

         const validatePassword = bcrypt.compareSync(password, user.password) // проверка валидности пароля
         if(!validatePassword){
           return res.status(400).json({message: 'Не верные данные пользователя'})
         }
         
         const cart = await user.getCart() //

         const token = jwt.sign({id: user.id, email: user.email, cartId: cart.id}, process.env.SECRET_KEY, {expiresIn: '1h'}) //создание токена с действием токена в 1 час

         return res.status(200).json({
            token,
            user:{
               id:user.id,
               email: user.email,
               avatar: user.avatar,
               cartId: cart.id
            },
            message: 'Авторизация прошла успешно!'
         })

         
      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка логинизации'})
      }
   }

   async auth(req, res) {
      try {
         const user = await User.findOne({where: {id: req.user.id}, include:{model: Cart, attributes:['id']}})
         const token = jwt.sign({id: user.id, email: user.email, cartId: user.Cart.id}, process.env.SECRET_KEY, {expiresIn: '1h'})
         return res.status(200).json({
            token,
            user:{
               id:user.id,
               email: user.email,
               avatar: user.avatar,
               cartId: user.Cart.id
            }
         })
      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка аутентификации'})
      }
   }

   

   
   
}

module.exports = new UserController()