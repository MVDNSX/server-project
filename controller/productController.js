const {Product} = require('../models/models')

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

  async pictureUpload (req, res) {
    try {
      if(req.user.role === 'test'){
        res.status(403).json({message: 'Для аккаунта Test загрузка изображений недоступна'})
      }
      if(req.user.role === 'admin'){
      const pathImage = req.file.path
      const onlyPickPath = pathImage.replace('dishImage/', '')
      res.status(200).json({url: onlyPickPath, message: 'Изображение загружено'})
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }



  async createProduct (req, res) {
    try {
      if(req.user.role === 'test'){
        res.status(403).json({message: 'Для аккаунта Test изменение бд недоступно'})
      }
      if(req.user.role === 'admin'){
        let {price, discount, name, categoryId, picture} = req.body // деструктуризация полученного блюда
        price = +price
        discount = +discount
        categoryId = +categoryId
        const checkProduct = await Product.findOne({where:{name}}) // проверка наличия такого блюда в БД
        if(checkProduct){
        return res.status(400).json({message: 'Такое блюдо уже существует'})
        }

        const finalPrice = +(price - (price * discount / 100 )).toFixed(2) // расчет финальной цены блюда
        const product = await Product.create({categoryId, name, price, discount, finalPrice, picture}) // создание блюда в БД

        res.status(200).json(product) // Возврат ответа с созданным блюдом
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  
  async editProduct(req, res) {
    try {
      if(req.user.role === 'test'){
        res.status(403).json({message: 'Для аккаунта Test изменение бд недоступно'})
      }
      if(req.user.role === 'admin'){
        let {productId, price, discount, categoryId, name, picture} = req.body
        productId = +productId
        price = +price
        discount = +discount
        categoryId = +categoryId
  
        const checkProduct = await Product.findOne({where:{productId}})
        if(!checkProduct){
          return res.status(400).json({message: 'Блюдо не найдено'})
        }
        const finalPrice = +(price - (price * discount / 100 )).toFixed(2)
        
        const product = await Product.update({picture,name, price, discount,categoryId, finalPrice}, {
          returning: true,
          where: {productId}
        })
        res.status(200).json(product)
      }
      
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }

  async deleteProduct(req, res) {
    try {
      if(req.user.role === 'admin'){
        const productId = +req.params.productId
        const checkProduct = await Product.findOne({where:{productId}})
        if(!checkProduct){
          return res.status(400).json({message: 'Блюдо не найдено'})
        }
        await Product.destroy({where:{productId}})
        res.status(200).json({message: 'Блюдо успешно удалено'})
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
}

module.exports = new dishesController()