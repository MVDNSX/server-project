const uuid = require('uuid')
const {User, Dish} = require('../models/models')
const fs = require('fs')


class ImgController {
  async loadAvatar(req, res) {
    try {
      const file = req.files.file // получение файла
      const user = await User.findOne({where:{id: req.user.id}}) // находим пользователя которому добавляем аватар
      if(user.avatar){
        fs.unlinkSync(process.env.AVATAR_PATH + '\/' + user.avatar) //удаляем старый аватар из папки
        user.avatar = null; 
      }
      const avatarName = uuid.v4() + '.jpg' //генерируем название файла
      file.mv(process.env.AVATAR_PATH + '\/' + avatarName) // перемещаем файл в папку
      user.avatar = avatarName; // записываем путь к аватарке в данные пользователя
      user.save() //сохраняем изменения
      return res.status(200).json({message:'Аватар был успешно добавлен'})
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Ошибка сервера'})
    }
  }

  async loadDishImg(req,res){
    const file = req.files.file
    const user = await User.findOne({where:{id: req.user.id}})
    const dish = await Dish.findOne({where:{dishId: req.dish.dishId}})
    if(!user.role === 'admin'){
      res.status(200).json({message: 'Ошибка доступа'})
    }
    const imageName = uuid.v4() + '.jpg'
    file.mv(process.env.DISHES_PATH + '\/' + imageName)
    dish.image = imageName
  }
}

module.exports = new ImgController()