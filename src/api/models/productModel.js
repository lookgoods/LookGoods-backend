import Mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
    product_id: Schema.Types.ObjectId,
    name: String,
    price: Number,
    tag: [],
    brand: String

})

export default Mongoose.model('Product', ProductSchema);
