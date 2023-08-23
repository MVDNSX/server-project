const {User} = require('../models/models')
const bcrypt = require('bcrypt')

class UserContriller {
   async check(req, res) {
    res.status(200).json({massage: 'working'})
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
   
}

module.exports = new UserContriller()