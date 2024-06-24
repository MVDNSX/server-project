const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель пользователя
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: false,
});

// Модель корзины
const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  savedAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  totalCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
}, {
  timestamps: false
});

Cart.prototype.calculateTotals = async function() {
  const items = await CartItem.findAll({ where: { cartId: this.id } });
  let totalCost = 0;
  let savedAmount = 0;

  for (const item of items) {
    const product = await Product.findByPk(item.productId);

    const price = product.price * item.quantity
    const promoPrice = product.promoPrice ? product.promoPrice * item.quantity : null

    if(promoPrice){
      totalCost += promoPrice
      savedAmount += price - promoPrice
    }else{
      totalCost += price
    }

  }
  this.totalCost = totalCost;
  this.savedAmount = savedAmount;
  await this.save();
};

// Модель продукта
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  picture: { type: DataTypes.STRING, allowNull: true },
  discount: { type: DataTypes.INTEGER, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  promoPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00},
}, {
  timestamps: false
});

// Модель продукта в корзине
const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  productPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  productPromoPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
}, {
  timestamps: false
});

// Модель категории
const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  timestamps: false
});

// Связи между моделями
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'cartId' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Синхронизация моделей с базой данных
//sequelize.sync({ force: true }).then(() => {
//  console.log('Database & tables created!');
//});

module.exports = { User, Cart, Product, Category, CartItem };



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



//  Product.addHook("afterSave", async (product) => {
//    try {
//        const cartItems = await CartItem.findAll({
//            where: {
//                productId: product.id
//            }
//        });

//        for (let cartItem of cartItems) {
//            const cart = await Cart.findByPk(cartItem.cartId);
//            if (cart) {
//                await cart.updateProduct(product, cartItem.quantity);
//            }
//        }
//    } catch (error) {
//        console.error('Ошибка при обновлении продукта в корзине: ', error);
//    }
//});

//Cart.prototype.updateProduct = async function(product, quantity) {
//    try {
//        this.totalCost = quantity * (product.discount ? product.promoPrice : product.price);
//        await this.save();
//    } catch (error) {
//        console.error('Ошибка при обновлении продукта в корзине: ', error);
//    }
//};
