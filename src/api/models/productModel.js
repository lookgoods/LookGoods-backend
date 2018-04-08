import Mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
	name: String,
	brand: String

})

export default Mongoose.model('Product', ProductSchema)
