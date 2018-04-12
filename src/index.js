import BodyParser from 'body-parser'
import Express from 'express'
import Session from 'express-session'
import ConnectMongo from 'connect-mongo'
import Mongoose from 'mongoose'
import Routes from './api/routes/lookgoodsRoutes'
import Auth from './api/models/auth'
import DotEnv from 'dotenv'
// import Socket from 'socket-io-server'
// import Http from 'http'

DotEnv.config()

const port = process.env.PORT || 3000
const usernameDB = process.env.DATABASE_USERNAME
const passwordDB = process.env.DATABASE_PASSWORD

const MONGO_URI = `mongodb://${usernameDB}:${passwordDB}@localhost/LookGoodsDB?authSource=admin`

const app = Express()

app.use(Auth.initialize())
app.use(Auth.session())
// const server = Http.Server(app)

// Socket.init(server)
// server.listen(port)

// Socket.broadcast('ws-client-id', 'emit-client', {
// 	data: []
// })

// mongoose instance connection url connection
Mongoose.Promise = global.Promise
Mongoose.connect(MONGO_URI)

const MongoStore = ConnectMongo(Session)
app.use(Session({
	key: 'session',
	secret: 'SUPER SECRET SECRET',
	store: new MongoStore({
		url: MONGO_URI
	})
}))

app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())

Routes(app) // register the route

app.listen(port, () => console.log('LookGoods RESTful API server started on: ' + port, new Date()))
