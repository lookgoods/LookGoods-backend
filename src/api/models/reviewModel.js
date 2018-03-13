import Mongoose, { Schema } from 'mongoose'

const ReviewSchema = new Schema({
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    picture_cover_url: String,
    content_list: [],
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_list: [],
    like_by_list: [],
    rating: Number,
    timestamp: { type: Date, default: Date.now }

})

export default Mongoose.model('Review', ReviewSchema);
