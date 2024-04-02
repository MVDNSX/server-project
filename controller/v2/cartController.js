const {Cart, Product} = require('../../models/modelsV2')

class cartController {
  async addProductInCart(req, res) {
    try {
      const {productId: ProductId} = req.body
      const {userId: UserId} = req.body
      const product = await Product.findByPk(ProductId)
      const cart = await Cart.create({
          ProductId,
          UserId,
          quantity: 1,
      })
      await cart.updateProduct(product)
      res.status(200).json({massage: 'addProductInCart complete'})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'addProductCart error'})
    }}

  async getCart(req, res) {
    try {
      const cart = await Cart.findAll({
        where: {UserId: 1},
        include: {
          model: Product,
          attributes: {
            exclude: ['CategoryId']
          }
        }
      })
      return res.status(200).json(cart)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'getCart error'})
    }
  }

  async changeQuantityProduct(req, res){
    try {
      const {userId: UserId, productId: ProductId, quantity} = req.body

      const product = await Product.findByPk(ProductId)
      const cart = await Cart.findOne({where:{UserId, ProductId}})

      cart.quantity = quantity
      cart.save()
      await cart.updateProduct(product)
      
      res.status(200).json({message: 'changeQuantityProduct complete'})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'changeQuantityProduct error'})
    }
  }
}

module.exports = new cartController()