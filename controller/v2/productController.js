const {Category, Product} = require('../../models/modelsV2')
const {Op} = require('sequelize')

class productController {
  async allProductData(req, res) {
    try {
      const category = await Category.findAll({
        attributes: ['id']
      })
      const data = await Category.findAll({
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
      return res.status(200).json({data})
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'allCategoryData error'})
    }
  }
}

module.exports = new productController()