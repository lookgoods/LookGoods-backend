import Mongoose, { Schema } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate'

const ReviewSchema = new Schema({
	title: { type: String },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	picture_cover_url: String,
	picture_thumbnail_url: String,
	content_list: [],
	price: Number,
	product: { type: Schema.Types.ObjectId, ref: 'Product' },
	comment_list: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	like_by_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	rating: Number,
	timestamp: { type: Date, default: Date.now },
	available: Boolean,
	tag: [{ type: String }],
	chat_list: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]

})

ReviewSchema.plugin(MongoosePaginate)
ReviewSchema.index(
	{
		title: 1,
		tag: 1
	},
	{ default_language: 'english' }
)

export default Mongoose.model('Review', ReviewSchema)
