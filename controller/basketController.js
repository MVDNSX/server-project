
const {Basket, Dish, BasketItem } = require('../models/models')

class basketController {
  async addDish (req, res) {
    try {     
      const {basketId, dishId, count, comment} = req.body // получаем данные из запроса
      const bdDish = await Dish.findOne({where:{dishId}}) // получаем данные блюда из БД
      const basketItems = await BasketItem.findOne({where:{basketId, dishId}}) // проверка наличия такого же блюда в корзине
      if(basketItems){
        basketItems.count += 1; // если блюдо уже в корзине то увеличиваем количество
        basketItems.totalCost = +(basketItems.count * bdDish.finalPrice).toFixed(2) // пересчитываем стоимость в зависимости от нового количества
        await basketItems.save()
        return res.status(200).json(basketItems)
      }else{
        const dish = await BasketItem.create({count, comment, dishId, basketId, totalCost: bdDish.finalPrice}) // иначе добавляем блюдо в корзину
        return res.status(200).json(dish)
      }

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async changeComment(req, res) {
    try {
      const {basketId, dishId, comment} = req.body
      const item = await BasketItem.findOne({where:{basketId, dishId}})
      item.set({
        comment
      })
      await item.save()

      const answer = await Basket.findOne({where:{basketId}, include:{model:Dish}})
      res.status(200).json(answer)
    } catch (error) {
      
    } 
  }

  async changeCount(req, res){
    try {
      const {basketId, dishId, count} = req.body
      const bdDish = await Dish.findOne({where:{dishId}})
      const item = await BasketItem.findOne({where:{basketId, dishId}})
      item.set({
        count
      })
      item.totalCost = +(item.count * bdDish.finalPrice).toFixed(2)
      await item.save()
      const answer = await Basket.findOne({where:{basketId}, include:{model:Dish}})
      res.status(200).json(answer)
    } catch (error) {
      
    } 
  }

  async deleteDish(req, res){
    try {
      const {basketId, dishId} = req.query
      await BasketItem.destroy({where: {basketId, dishId}, returning: true})//попробовать then
      const answer = await Basket.findOne({where:{basketId}, include:{model:Dish}})
      res.status(200).json(answer)
    } catch (error) {
      
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