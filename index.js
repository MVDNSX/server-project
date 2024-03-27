require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/modelsV2')
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const corsMiddleware = require('./middleware/cors.midleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(corsMiddleware)
app.use(fileUpload({}))
app.use(cors())
app.use(express.json())
app.use(express.static('image/userAvatars/'))
app.use(express.static('image/dishesImage/'))
app.use('/api', router)

const start = async () => {
  try {
    await sequelize.authenticate(); //установка подключения к бд
    await sequelize.sync() //сверка состояния бд
    app.listen(PORT, () => {
      console.log(`server started on port: ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()