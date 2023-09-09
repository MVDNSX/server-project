
const {Basket, Product, ProductBasket } = require('../models/models')

const recalcBasketPrice = async (basketId) => {
  const basket = await Basket.findOne({where:{basketId}, include: {model: Product}})
  const totalCostBasket = basket.products.map(item => item.product_basket.totalCostProduct).reduce((acc, cur) => acc + cur, 0).toFixed(2)
  const totalDiscountBasket = basket.products.map(item => item.product_basket.totalDiscountProduct).reduce((acc, cur) => acc + cur, 0).toFixed(2)
  await basket.set({
  totalCostBasket,
  totalDiscountBasket
  })
  await basket.save()
}

const recalcProductPrice = async (item, product) => {
  let totalCostProduct = +(item.count * product.finalPrice).toFixed(2)
  let totalDiscountProduct = +((product.price - product.finalPrice) * item.count).toFixed(2)
  await item.set({
    totalCostProduct,
    totalDiscountProduct
  }) // записываем новые данные
  await item.save()
}

class basketController {
  async getItemsBasket(req, res){
    try {
    const {basketId} = req.user
    const basket = await Basket.findOne({where:{basketId}, attributes:{exclude:['createdAt', 'updatedAt', 'userId']}, include:{model: Product, attributes:{exclude:['createdAt', 'updatedAt', 'categoryId', 'discount']}}})
    res.status(200).json(basket)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }

  async addItemBasket (req, res) {
    try {     
      const {basketId} = req.user // получаем Id корзины в БД
      const {productId} = req.body // получаем данные из запроса

      let product = await ProductBasket.findOne({where:{basketId, productId}}) // проверка наличия такого же блюда в корзине
      const bdDish = await Product.findOne({where:{productId}}) // получаем данные блюда из БД
      if(product){
        await product.increment('count', {by: 1})// если блюдо уже в корзине то увеличиваем количество
      }else{
        product = await ProductBasket.create({productId, basketId, totalCost: bdDish.finalPrice}) // иначе добавляем блюдо в корзину
      }
      await recalcProductPrice(product, bdDish) // пересчитываем общую скидку и стоимость продукта в зависимости от количества и сохраняем значение в бд   
      await recalcBasketPrice(basketId)

      const basket = await Basket.findOne({where:{basketId}, attributes:['totalCostBasket', 'totalDiscountBasket'], include:{model: Product, where:{productId}, attributes:{exclude:['createdAt', 'updatedAt', 'categoryId']}}})
      return res.status(200).json(basket)

    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    }
  }

  async changeItemCount(req, res){
    try {
      const {basketId} = req.user
      const {productId, count} = req.body // аналогично изменению комментария // подумать об использовании upsert для обновления набором из количества и комментария
      const bdDish = await Product.findOne({where:{productId}})
      const product = await ProductBasket.findOne({where:{basketId, productId}}) // ищем обЪект изменения 
      product.set({
        count
      }) // меняем количество
      product.totalCost = +(product.count * bdDish.finalPrice).toFixed(2) // пересчитываем стоимость от количества
      await product.save() //сохраняем
      await recalcProductPrice (product, bdDish)
      await recalcBasketPrice(basketId)

      const {totalCostBasket, totalDiscountBasket} = await Basket.findOne({where:{basketId}, attributes: ['totalCostBasket', 'totalDiscountBasket']})

      const answer = {
        product_basket:{
          productId:product.productId,
          count:product.count,
          totalCostProduct:product.totalCostProduct,
          totalDiscountProduct:product.totalDiscountProduct
        },
        totalCostBasket,
        totalDiscountBasket,
      }
      
      res.status(200).json(answer)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    } 
  }

  async changeItemComment(req, res) {
    try {
      const {basketId} = req.user
      const {productId, comment} = req.body // деструктуризируем тело запроса
      if(!productId) {
        return res.status(400).json({message: 'Ошибка productId'})
      }
      const product = await ProductBasket.findOne({where:{basketId, productId}}) // находим элемент корзины
      await product.set({
        comment
      }) // записываем комментарий из запроса в информацию к элементу корзины
      await product.save() // сохраняем изменения

      const answer = {
        product_basket:{
          productId:product.productId,
          comment:product.comment,
        }
      }
      res.status(200).json(answer)
    } catch (error) {
      console.log(error)
      res.status(400).json({message: 'Ошибка сервера'})
    } 
  }

  async deleteItemBasket(req, res){
    try {
      const basketId = req.user.basketId
      const productId = +req.params.productId// получаем корзину пользователя и элемент удаления
      if(!basketId) {
        return res.status(400).json({message: 'Ошибка basketId'})
      }
      if(!productId) {
        return res.status(400).json({message: 'Ошибка productId'})
      }
      await ProductBasket.destroy({where: {basketId, productId}, returning: true})//удаляем элемент из корзины  // подумать о том чтобы попробовать then из промисов
      await recalcBasketPrice(basketId)

      const answer = await Basket.findOne({where:{basketId}, attributes:['totalDiscountBasket', 'totalCostBasket']})
      
      return res.status(200).json(answer)
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Ошибка сервера'})
    }

  }
}

module.exports = new basketController()
