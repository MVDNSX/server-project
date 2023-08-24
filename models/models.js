const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type:DataTypes.STRING, unique: true},
  password: {type:DataTypes.STRING}
}
)

const Dish = sequelize.define('Dish', {
  dishId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  categoryId: {type: DataTypes.INTEGER},
  name: {type: DataTypes.STRING, unique:true},
  price: {type: DataTypes.DOUBLE},
  discount: {type: DataTypes.INTEGER},
  finalPrice: {type: DataTypes.DOUBLE},
}
) 

module.exports = {User, Dish}