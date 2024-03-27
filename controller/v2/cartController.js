const { JSONB } = require('sequelize')
const {User, Cart, Product} = require('../../models/modelsV2')

class cartController {
  async addProductCart(req, res) {
    try {
      const cart = await Cart.findOne({where: {UserId: 1}})
      const product = await Product.findOne({where: {id: 2}, attributes: {exclude: ['CategoryId']}}).then(product => product.toJSON())
      const addedProduct = {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          subTotal: product.price,
          itemInfo: {...product},
      }
      cart.products = [
        ...cart.products,
        {...addedProduct}
      ]
      cart.changed('products', true)
      await cart.save()

      return res.status(200).json(cart)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'addProductCart error'})
    }}

  async getCart(req, res) {
    try {
      const cart = await Cart.findOne({where: {UserId: 1}})

      return res.status(200).json(cart.toJSON())
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'addProductCart error'})
    }
  }
}

module.exports = new cartController()