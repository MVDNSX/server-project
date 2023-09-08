const {Product} = require('../models/models')
const uuid = require('uuid')
const fs = ('fs')

class dishesController {
  async allProduct (req, res) {
    try {
      const products = await Product.findAll()
      return res.status(200).json(products)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async createProduct (req, res) {
    try {
      const {price, discount, name} = req.body // деструктуризация полученного блюда
      const picture = req.files.file // получаем файл из запроса

      const checkProduct = await Product.findOne({where:{name}}) // проверка наличия такого блюда в БД
      if(checkProduct){
       return res.status(400).json({message: 'Такое блюдо уже существует'})
      }
      const pictureName = uuid.v4() + '.png' // генерируем название картинки
      picture.mv(process.env.DISHES_PATH + '\/' + pictureName); // перемещаем файл с папку с изображениями блюд
      const finalPrice = +(price - (price * discount / 100 )).toFixed(2) // расчет финальной цены блюда
      const product = await Product.create({...req.body, finalPrice, picture: pictureName}) // создание блюда в БД

      res.status(200).json(product) // Возврат ответа с созданным блюдом
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  
  async editProduct(req, res) {
    try {
      const {productId, price, discount} = req.body

      const checkProduct = await Product.findOne({where:{productId}})
      if(!checkProduct){
        return res.status(400).json({message: 'Блюдо не найдено'})
      }
      const finalPrice = +(price - (price * discount / 100 )).toFixed(2)
      
      const product = await Product.update({...req.body, finalPrice}, {
        returning: true,
        where: {productId}
      })
      res.status(200).json(product)

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = +req.params.productId
      const checkProduct = await Product.findOne({where:{productId}})
      if(!checkProduct){
        return res.status(400).json({message: 'Блюдо не найдено'})
      }
      await Product.destroy({where:{productId}})
      res.status(200).json({message: 'Блюдо успешно удалено'})
      
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
}

module.exports = new dishesController()