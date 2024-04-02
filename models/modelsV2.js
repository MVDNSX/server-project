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
  quantity: {type: DataTypes.INTEGER},
  totalCost: {type:DataTypes.INTEGER}
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

  Cart.belongsTo(Product)

  Product.addHook("afterSave", async (product) => {
    try {
      const carts = await Cart.findAll({
        where: {
          ProductId: product.id
        }
      })
      for(let cart of carts){
        cart.updateProduct(product)
      }
    } catch (error) {
      console.error('Ошибка при обновлении продукта в корзине: ', error);
    }
  })

  Cart.prototype.updateProduct = async function(product){
    try {
      this.totalCost = this.quantity * (product.discount ? product.promoPrice : product.price)
      await this.save()

    } catch (error) {
      console.error('Ошибка при обновлении продукта в корзине: ', error);
    }
  }


  module.exports = {User, Cart, Category, Product}

