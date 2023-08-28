
const {Order, Dish, OrderItem} = require('../models/models')

class orderController {
  async createOrder(req, res) {
    try {
      const dishes = req.body.dishes
      const order = await Order.create()
      for(let i = 0; i < 2; i++ ){
        const bdDish = await Dish.findOne({where:{dishId: dishes[i].dishId}})
        await OrderItem.create({orderId: order.orderId, dishId: dishes[i].dishId, count: dishes[i].count, totalCost: dishes[i].count *  bdDish.finalPrice})
      }

      const finalOrder = await Order.findOne({where:{orderId:order.orderId}, include: Dish})
      res.status(200).json(finalOrder.Dishes)

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }
  async addDish (req, res) {
  }
}

module.exports = new orderController()

//const dishes = req.body
      //const order = await Order.create()
      //for(let i = 0; i < 1; i++ ){
      //  await order.addDish(dishes[i].dishesId)
      //}

      //const finalOrder = await Order.findOne({where:{orderId:25}, include: Dish})
      //res.status(200).json(finalOrder.Dishes)