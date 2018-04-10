import Mongoose, { Schema } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate'

const CommentSchema = new Schema({
	description: String,
	rating: Number,
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	timestamp: { type: Date, default: Date.now }

})

CommentSchema.plugin(MongoosePaginate)

export default Mongoose.model('Comment', CommentSchema)
