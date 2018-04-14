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
// const Product = Mongoose.model('Product', ProductSchema)

// Product.collection.getIndexes(['name', 'brand'], (err, result) => {
// 	if (err) {
// 		console.log('Error in dropping index!', err)
// 	}
// 	console.log(result)
// })
// export default Product
