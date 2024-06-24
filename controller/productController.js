const {Category, Product} = require('../../models/modelsV2')
const {Op} = require('sequelize')

const calcPromoPrice = (productPrice, productDiscount) => {
  return productPrice * (1 - productDiscount / 100)
}

class productController {
  async allProductData(req, res) {
    try {
      const category = await Category.findAll({
        attributes: ['id']
      })
      const product = await Category.findAll({
        include: [{
          attributes:{
            exclude: ['CategoryId']
          },
          model: Product,
          where: { 
            CategoryId: {
              [Op.in]: category.map(c => c.id),
            }
          }
        }]
      })
      return res.status(200).json({product})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'allCategoryData error'})
    }
  }
  async addProduct(req, res){
    try {
      const product = req.body

      const newProduct = Product.build({
        ...product,
        promoPrice: calcPromoPrice(product.price, product.discount)
      })

      await newProduct.save()
      return res.status(200).json(newProduct)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'addProduct error'})
    }
  }

  async editProduct(req, res){
    try {
      const {id, available, name, description, picture, discount, price, CategoryId} = req.body
      const product = await Product.findByPk(id)
      product.available = available
      product.name = name
      product.description = description
      product.picture = picture
      product.discount = discount
      product.price = price
      product.promoPrice = calcPromoPrice(price, discount)
      product.CategoryId = CategoryId
      await product.save()

      res.status(200).json(product)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'editProduct error'})
    }
  }

}

module.exports = new productController()