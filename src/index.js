import BodyParser from 'body-parser'
import Express from 'express'
import Mongoose from 'mongoose'
import Routes from './api/routes/lookgoodsRoutes'
import Auth from './api/models/auth'

const port = process.env.PORT || 3000
const MONGO_URI = 'mongodb://localhost/LookGoodsDB'

const app = Express()

app.use(Auth.initialize())
app.use(Auth.session())

// mongoose instance connection url connection
Mongoose.Promise = global.Promise
Mongoose.connect(MONGO_URI)

app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())

Routes(app) //register the route

app.listen(port, () => console.log('LookGoods RESTful API server started on: ' + port))
