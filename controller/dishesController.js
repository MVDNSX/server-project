const {Dish} = require('../models/models')
const uuid = require('uuid')
const fs = ('fs')

class dishesController {
  async allDishes (req, res) {
    try {
      const dishes = await Dish.findAll()
      return res.status(200).json(dishes)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async createDish (req, res) {
    try {
      const {price, discount, name} = req.body // деструктуризация полученного блюда
      const picture = req.files.file // получаем файл из запроса

      const checkDish = await Dish.findOne({where:{name}}) // проверка наличия такого блюда в БД
      if(checkDish){
       return res.status(400).json({message: 'Такое блюдо уже существует'})
      }
      const pictureName = uuid.v4() + '.png' // генерируем название картинки
      picture.mv(process.env.DISHES_PATH + '\/' + pictureName); // перемещаем файл с папку с изображениями блюд
      const finalPrice = +(price - (price * discount / 100 )).toFixed(2) // расчет финальной цены блюда
      const dish = await Dish.create({...req.body, finalPrice, picture: pictureName}) // создание блюда в БД

      res.status(200).json(dish) // Возврат ответа с созданным блюдом
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  
  async editDish(req, res) {
    try {
      const {dishId, price, discount} = req.body

      const checkDish = await Dish.findOne({where:{dishId}})
      if(!checkDish){
        return res.status(400).json({message: 'Блюдо не найдено'})
      }
      const finalPrice = +(price - (price * discount / 100 )).toFixed(2)
      
      const dish = await Dish.update({...req.body, finalPrice}, {
        returning: true,
        where: {dishId}
      })
      res.status(200).json(dish)

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }

  async deleteDish(req, res) {
    try {
      const dishId = +req.params.dishId
      const checkDish = await Dish.findOne({where:{dishId}})
      if(!checkDish){
        return res.status(400).json({message: 'Блюдо не найдено'})
      }
      const a = await Dish.destroy({where:{dishId}})
      res.status(200).json({message: 'Блюдо успешно удалено'})
      
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
}

module.exports = new dishesController()