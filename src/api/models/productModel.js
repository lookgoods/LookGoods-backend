import Mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
    id_product: Schema.Types.ObjectId,
    name: String,
    picture_url: String,
    price: Number,
    owner_review: String,
    rating_by_owner: Number,
    category: String

})

export default Mongoose.model('Product', ProductSchema);
