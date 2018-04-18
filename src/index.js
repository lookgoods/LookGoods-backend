import BodyParser from 'body-parser'
import Express from 'express'
import Session from 'express-session'
import ConnectMongo from 'connect-mongo'
import Mongoose from 'mongoose'
import Routes from './api/routes/lookgoodsRoutes'
import Auth from './api/models/auth'
import DotEnv from 'dotenv'
import Http from 'http'
import Socket from 'socket.io'

DotEnv.config()

const port = process.env.PORT || 3000
const usernameDB = process.env.DATABASE_USERNAME
const passwordDB = process.env.DATABASE_PASSWORD

const MONGO_URI = `mongodb://${usernameDB}:${passwordDB}@localhost/LookGoodsDB?authSource=admin`

const app = Express()

app.use(Auth.initialize())
app.use(Auth.session())

const server = Http.createServer(app)
const io = Socket(server)

const onlineUser = []
io.on('connection', (socket) => {
	// console.log('user connected ', socket.id)
	socket.on('disconnect', () => {
		const user = onlineUser.find(i => i.id === socket.id)
		console.log(user)
		onlineUser.pop(user)
		console.log('user disconnected')
		console.log(onlineUser)
	})
	socket.on('authenUser', (data) => {
		if (typeof data === 'string') {
			var object = JSON.parse(data)
			const user = { id: socket.id, user_id: object.userId }
			onlineUser.push(user)
			console.log('authenUser', socket.id)
			console.log(onlineUser)
		}
	})
	socket.on('notify', (data) => {
		if (typeof data === 'string') {
			var object = JSON.parse(data)
			for (var i in object.followerList) {
				var user = onlineUser.find(id => id.user_id === object.followerList[i])
				if (user !== 'undefined') {
					console.log('notify user ', user)
					socket.to(user.id).emit('notify', (new Date()))
				}
			}
		}
	})
})

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

// app.listen(port, () => console.log('LookGoods RESTful API server started on: ' + port, new Date()))
server.listen(port, () => {
	console.log('LookGoods RESTful API server started on: ' + port, new Date())
})

export default io
