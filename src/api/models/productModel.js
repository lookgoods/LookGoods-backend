import Mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
    name: String,
    tag: [],
    brand: String

})

export default Mongoose.model('Product', ProductSchema);
