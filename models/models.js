const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type:DataTypes.STRING, unique: true},
  password: {type:DataTypes.STRING},
  avatar: {type: DataTypes.STRING, allowNull:true}
}
)


const Product = sequelize.define('product', {
  productId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  categoryId: {type: DataTypes.INTEGER},
  name: {type: DataTypes.STRING, unique:true},
  picture: {type:DataTypes.STRING},
  price: {type: DataTypes.DOUBLE},
  discount: {type: DataTypes.INTEGER},
  finalPrice: {type: DataTypes.DOUBLE},
}
) 

const Basket = sequelize.define('basket', {
  basketId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  totalDiscount: {type: DataTypes.DOUBLE},
  totalCostBasket: {type: DataTypes.DOUBLE}
})

const ProductBasket = sequelize.define('product_basket', {
  count:{type:DataTypes.INTEGER, defaultValue: 1},
  comment: {type:DataTypes.STRING, defaultValue: ''},
  totalCost: {type: DataTypes.DOUBLE},
}, { timestamps: false })



//const Order = sequelize.define('Order', {
//  orderId: {type: DataTypes.INTEGER,primaryKey: true, autoIncrement: true},
//  totalCostOrder: {type: DataTypes.DOUBLE},
//  totalDiscountOrder:{type: DataTypes.DOUBLE},
//  status: {type:DataTypes.STRING}
//})

User.hasOne(Basket, {foreignKey: 'userId'})
Basket.belongsTo(User)

Basket.belongsToMany(Product, {through: ProductBasket, foreignKey: 'basketId'})
Product.belongsToMany(Basket, {through: ProductBasket, foreignKey: 'productId'})

module.exports = {User, Product, Basket, ProductBasket}