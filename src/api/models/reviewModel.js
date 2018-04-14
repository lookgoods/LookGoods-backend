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
	tag: [{ type: String }]

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
// const Review = Mongoose.model('Review', ReviewSchema)

// Review.collection.getIndexes(['title', 'tag'], (err, result) => {
// 	if (err) {
// 		console.log('Error in dropping index!', err)
// 	}
// 	console.log(result)
// })
// export default Review
