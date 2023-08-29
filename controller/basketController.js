
const { where } = require('sequelize')
const {Basket, Dish, BasketItem } = require('../models/models')

class basketController {
  async getItemsBasket(req, res){
    try {
    const basketId = 1
    const basket = await Basket.findOne({where:{basketId}, include: Dish})
    res.status(200).json(basket)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async addItemBasket (req, res) {
    try {     
      const {basketId, dishId} = req.body // получаем данные из запроса
      const bdDish = await Dish.findOne({where:{dishId}}) // получаем данные блюда из БД
      const basketItems = await BasketItem.findOne({where:{basketId, dishId}}) // проверка наличия такого же блюда в корзине
      if(basketItems){
        await basketItems.increment('count', {by: 1})// если блюдо уже в корзине то увеличиваем количество
        await basketItems.set({
          totalCost:+(basketItems.count * bdDish.finalPrice).toFixed(2)
        }) // пересчитываем стоимость в зависимости от нового количества
        await basketItems.save()
        return res.status(200).json(basketItems)
      }else{
        const dish = await BasketItem.create({dishId, basketId, totalCost: bdDish.finalPrice}) // иначе добавляем блюдо в корзину
        return res.status(200).json(dish)
      }

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async changeItemComment(req, res) {
    try {
      const {basketId, dishId, comment} = req.body // деструктуризируем тело запроса
      const item = await BasketItem.findOne({where:{basketId, dishId}}) // находим элемент корзины
      await item.set({
        comment
      }) // записываем комментарий из запроса в информацию к элементу корзины
      await item.save() // сохраняем изменения

      const answer = await Basket.findOne({where:{basketId}, include:{model:Dish}})
      res.status(200).json(answer)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    } 
  }

  async changeItemCount(req, res){
    try {
      const {basketId, dishId, count} = req.body // аналогично изменению комментария // подумать об использовании upsert для обновления набором из количества и комментария
      const bdDish = await Dish.findOne({where:{dishId}})
      const item = await BasketItem.findOne({where:{basketId, dishId}}) // ищем обЪект изменения 
      item.set({
        count
      }) // меняем
      item.totalCost = +(item.count * bdDish.finalPrice).toFixed(2) // пересчитываем
      await item.save()
      const answer = await Basket.findOne({where:{basketId}, include:{model:Dish}})
      res.status(200).json(answer)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    } 
  }

  async deleteItemBasket(req, res){
    try {
      const dishId = +req.params.dishId// получаем корзину пользователя и элемент удаления
      await BasketItem.destroy({where: {basketId:1, dishId}, returning: true})//удаляем элемент из корзины  // подумать о том чтобы попробовать then из промисов
      const answer = await Basket.findOne({where:{basketId:1}, include:{model:Dish}})
      res.status(200).json(answer)
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