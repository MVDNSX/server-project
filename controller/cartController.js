const {Cart, Product, CartItem} = require('../models/modelsV2')

class cartController {

  async getCart(req, res) {

    try {
      const user = req.user
      const cartUser = await Cart.findAll({
        where: {userId: user.id},
        include: {
          model: Product,
          attributes: {
            exclude: ['categoryId']
          }
        }
      })
      return res.status(200).json(cartUser)

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'getCart error'})
    }
  }

  async addProductInCart(req, res) {
    try {
      const {productId, quantity} = req.body
      const {id, cartId} = req.user


      const cart = await Cart.findByPk(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      let cartItem = await CartItem.findOne({where: {
        cartId: cart.id,
        productId,
      }})

      if(quantity === 0){
        if(cartItem){
          await cartItem.destroy()
        }
      }else{
        const price = product.price * quantity;
        const promoPrice = product.promoPrice ? product.promoPrice * quantity : null
        if(cartItem){
          cartItem.quantity = quantity,
          cartItem.productPrice = price,
          cartItem.productPromoPrice = promoPrice
          await cartItem.save()
        }else{
          cartItem = await CartItem.create({
            quantity,
            productPrice: price,
            productPromoPrice: promoPrice,
            cartId: cart.id,
            productId,
          })
        }
      }

      await cart.calculateTotals();

      res.status(200).json({massage: 'addProductInCart complete'})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'addProductCart error'})
    }}

  

  async clearCart(req, res){
    try {
      const { cartId } = req.user;
  
      const cart = await Cart.findByPk(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      // Удаляем все элементы корзины
      await CartItem.destroy({
        where: { cartId: cart.id }
      });
  
      // Обнуляем общую стоимость и скидку корзины
      cart.totalCost = 0;
      cart.savedAmount = 0;
      await cart.save();
  
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error clearing cart' });
    }
  }
}

module.exports = new cartController()