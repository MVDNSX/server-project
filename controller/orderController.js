const { User, Cart, CartItem, Order, OrderItem, Product } = require('../models/modelsV2')
const productController = require('./productController')

class OrderController {

   async allOrdersUser(req, res){
      try {
        
        const { id: userId } = req.user;

        const orders = await Order.findAll({
          where: { userId },
          include: {
            model: OrderItem,
            attributes: ['productName', 'quantity', 'productPrice']
          }
        });
  
        const result = orders.map(order => ({
          totalCost: order.totalCost,
          createdAt: order.createdAt,
          status: order.status,
          products: order.OrderItems.map(item => ({
            name: item.productName,
            price: item.productPrice,
            quantity: item.quantity
          }))
        }));
  
        res.status(200).json(result);

      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка allOrdersUser'})
      }
   }


   async createOrder(req, res){
      try {
        const { id: userId } = req.user;
      const cart = await Cart.findOne({ where: { userId }, include: CartItem });

      if (!cart) {
        return res.status(400).json({ message: 'Cart not found' });
      }

      await cart.calculateTotals();

      const order = await Order.create({
        userId,
        status: 'pending',
        totalCost: cart.totalCost
      });

      const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

      for (let item of cartItems) {
        const product = await Product.findByPk(item.productId);
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          productName: product.name, // Сохранение имени продукта на момент покупки
          quantity: item.quantity,
          productPrice: item.productPrice,
          productPromoPrice: item.productPromoPrice
        });
      }

      await CartItem.destroy({ where: { cartId: cart.id } });
      await cart.calculateTotals();
      res.status(201).json({ message: 'Order created', orderId: order.id });
      } catch (error) {
         console.log(error)
         res.status(400).json({message: 'Ошибка createOrder'})
      }
   }
 
   
}

module.exports = new OrderController()