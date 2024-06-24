const {Category, Product} = require('../../models/modelsV2')


class renderController {
  

  async addAllCategories(req, res) {
    try {
      const allCategories = await Category.bulkCreate(req.body)
      res.status(200).json(allCategories)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'createCategory error'})
    }
  }

  async addAllProducts(req, res) {
    try {
      const dishes = req.body
      const final = dishes.map((item) => {
        if(item.discount > 0){
          const finalPrice = +(item.price - (item.price * item.discount / 100 )).toFixed(2)
          return {...item, promoPrice: finalPrice}
        }else{
          return item
        }
      })
      const allProduct = await Product.bulkCreate(final)
      res.status(200).json(allProduct)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'AddAllProducts error'})
    }
  }
}

module.exports = new renderController()