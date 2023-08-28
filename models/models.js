const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type:DataTypes.STRING, unique: true},
  password: {type:DataTypes.STRING},
  avatar: {type: DataTypes.STRING, allowNull:true}
}
)


const Dish = sequelize.define('Dish', {
  dishId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  categoryId: {type: DataTypes.INTEGER},
  name: {type: DataTypes.STRING, unique:true},
  picture: {type:DataTypes.STRING},
  price: {type: DataTypes.DOUBLE},
  discount: {type: DataTypes.INTEGER},
  finalPrice: {type: DataTypes.DOUBLE},
}
) 

const Basket = sequelize.define('Basket', {
  basketId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  totalDiscount: {type: DataTypes.DOUBLE},
  totalCostBasket: {type: DataTypes.DOUBLE}
})

const BasketItem = sequelize.define('BasketItem', {
  count:{type:DataTypes.INTEGER},
  comment: {type:DataTypes.STRING},
  totalCost: {type: DataTypes.DOUBLE},
}, { timestamps: false })



//const Order = sequelize.define('Order', {
//  orderId: {type: DataTypes.INTEGER,primaryKey: true, autoIncrement: true},
//  totalCostOrder: {type: DataTypes.DOUBLE},
//  totalDiscountOrder:{type: DataTypes.DOUBLE},
//  status: {type:DataTypes.STRING}
//})

User.hasOne(Basket, {foreignKey: 'userId'})

Basket.belongsToMany(Dish, {through: BasketItem, foreignKey: 'basketId'})
Dish.belongsToMany(Basket, {through: BasketItem, foreignKey: 'dishId'})

module.exports = {User, Dish, Basket, BasketItem}