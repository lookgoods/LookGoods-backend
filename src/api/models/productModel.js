import Mongoose, { Schema } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate'

const ProductSchema = new Schema({
	name: String,
	brand: String

})

ProductSchema.plugin(MongoosePaginate)
ProductSchema.index(
	{
		name: 1,
		brand: 1
	}
)

export default Mongoose.model('Product', ProductSchema)
