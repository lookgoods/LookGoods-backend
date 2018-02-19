import Mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
    id_post: Schema.Types.ObjectId,
    id_product: String,
    id_owner: String,
    rating: Number,
    list_review: [],
    status: String

})

export default Mongoose.model('Post', PostSchema);
