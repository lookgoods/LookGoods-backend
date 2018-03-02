import Mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
    id_product: Schema.Types.ObjectId,
    name: String,
    price: String,
    tag: [],
    brand: String

})

export default Mongoose.model('Product', ProductSchema);
