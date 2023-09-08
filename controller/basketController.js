
const {Basket, Product, ProductBasket } = require('../models/models')

class basketController {
  async getItemsBasket(req, res){
    try {
    const {basketId} = req.user
    const basket = await Basket.findOne({where:{basketId}, attributes:{exclude:['createdAt', 'updatedAt', 'userId']}, include:{model: Product, attributes:{exclude:['createdAt', 'updatedAt', 'categoryId', 'discount']}}})
    res.status(200).json(basket)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  //async getOneItemBasket(req,res){
  //  try {
  //    const basketId = 1
  //    const dishId = +req.params.dishId
  //    const item = await BasketItem.findOne({where:{basketId, dishId}})
  //    return res.status(200).json(item)
  //  } catch (error) {
  //    console.log(error)
  //    res.status(400).json({message: 'Ошибка сервера'})
  //  }
  //}
  async addItemBasket (req, res) {
    try {     
      const {basketId} = req.user
      const {productId} = req.body // получаем данные из запроса
      if(!basketId) {
        return res.status(400).json({message: 'Ошибка basketId'})
      }
      if(!productId) {
        return res.status(400).json({message: 'Ошибка productId'})
      }
      const bdDish = await Product.findOne({where:{productId}}) // получаем данные блюда из БД
      const basketItems = await ProductBasket.findOne({where:{basketId, productId}}) // проверка наличия такого же блюда в корзине
      if(basketItems){
        await basketItems.increment('count', {by: 1})// если блюдо уже в корзине то увеличиваем количество
        await basketItems.set({
          totalCost:+(basketItems.count * bdDish.finalPrice).toFixed(2)
        }) // пересчитываем стоимость в зависимости от нового количества
        await basketItems.save()
        return res.status(200).json(basketItems)
      }else{
        await ProductBasket.create({productId, basketId, totalCost: bdDish.finalPrice}) // иначе добавляем блюдо в корзину
        const answer = await Basket.findOne({where:{basketId}, attributes:['basketId', 'totalDiscount', 'totalCostBasket'], include: {model: Product, where:{productId}, attributes:{exclude: ['categoryId', 'createdAt', 'updatedAt', 'discount']}}}) // возврат выборки данных с исключенными атрибутами
        
        return res.status(200).json(answer)
      }

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async changeItemComment(req, res) {
    try {
      const {basketId} = req.user
      const {productId, comment} = req.body // деструктуризируем тело запроса
      if(!basketId) {
        return res.status(400).json({message: 'Ошибка basketId'})
      }
      if(!productId) {
        return res.status(400).json({message: 'Ошибка productId'})
      }
      const product = await ProductBasket.findOne({where:{basketId, productId}}) // находим элемент корзины
      await product.set({
        comment
      }) // записываем комментарий из запроса в информацию к элементу корзины
      await product.save() // сохраняем изменения
      res.status(200).json({products:{
        productId: product.productId,
        product_basket: {
          comment:product.comment
        }
      }})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    } 
  }

  async changeItemCount(req, res){
    try {
      const {basketId} = req.user
      const {productId, count} = req.body // аналогично изменению комментария // подумать об использовании upsert для обновления набором из количества и комментария
      const bdDish = await Product.findOne({where:{productId}})
      const product = await ProductBasket.findOne({where:{basketId, productId}}) // ищем обЪект изменения 
      product.set({
        count
      }) // меняем количество
      product.totalCost = +(product.count * bdDish.finalPrice).toFixed(2) // пересчитываем стоимость от количества
      await product.save() //сохраняет
      res.status(200).json({products:{
        productId: product.productId,
        product_basket: {
          count:product.count,
          totalCost:product.totalCost
        }
      }})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    } 
  }

  async deleteItemBasket(req, res){
    try {
      const basketId = req.user.basketId
      const productId = +req.params.productId// получаем корзину пользователя и элемент удаления
      if(!basketId) {
        return res.status(400).json({message: 'Ошибка basketId'})
      }
      if(!productId) {
        return res.status(400).json({message: 'Ошибка productId'})
      }
      await ProductBasket.destroy({where: {basketId, productId}, returning: true})//удаляем элемент из корзины  // подумать о том чтобы попробовать then из промисов
      res.status(200).json({message: 'Удаление элемента прошло успешно'})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }

  }
}

module.exports = new basketController()

//const dishes = req.body
      //const order = await Order.create()
      //for(let i = 0; i < 1; i++ ){
      //  await order.addDish(dishes[i].dishesId)
      //}

      //const finalOrder = await Order.findOne({where:{orderId:25}, include: Dish})
      //res.status(200).json(finalOrder.Dishes)