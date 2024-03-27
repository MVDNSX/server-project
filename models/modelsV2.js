const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  avatar: {type: DataTypes.STRING, allowNull:true},
})

const Cart = sequelize.define('Cart', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
  products: {type: DataTypes.ARRAY(DataTypes.JSONB), defaultValue: []},
  },
  {
    createdAt:false,
    updatedAt: false,
    timestamps:false
  })

  const Category = sequelize.define('Category', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey:true},
    name: {type: DataTypes.STRING, allowNull: false},
    available: {type: DataTypes.BOOLEAN, allowNull:false}
  },
  {
    createdAt:false,
    updatedAt: false,
    timestamps:false
  })

  const Product = sequelize.define('Product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    available: {type: DataTypes.BOOLEAN, allowNull:false},
    name: {type: DataTypes.STRING, unique:true},
    description: {type: DataTypes.STRING},
    picture: {type:DataTypes.STRING},
    discount: {type: DataTypes.INTEGER},
    price: {type: DataTypes.DOUBLE},
    promoPrice: {type: DataTypes.DOUBLE},
  }, 
  {
    createdAt:false,
    updatedAt: false,
    timestamps:false
  })

  User.hasOne(Cart)
  Cart.belongsTo(User)

  Category.hasMany(Product)
  Product.belongsTo(Category)


  module.exports = {User, Cart, Category, Product}

