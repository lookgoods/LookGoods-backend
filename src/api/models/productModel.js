import Mongoose, { Schema } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate'

const ProductSchema = new Schema({
	name: { type: String },
	brand: { type: String }

})

ProductSchema.plugin(MongoosePaginate)
ProductSchema.index(
	{
		name: 1,
		brand: 1
	},
	{ default_language: 'english' }
)

export default Mongoose.model('Product', ProductSchema)
