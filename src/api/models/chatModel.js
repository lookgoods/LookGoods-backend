import Mongoose, { Schema } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate'

const ChatSchema = new Schema({
	description: String,
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	timestamp: { type: Date, default: Date.now }
})

ChatSchema.plugin(MongoosePaginate)

export default Mongoose.model('Chat', ChatSchema)
