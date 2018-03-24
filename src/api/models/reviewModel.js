import Mongoose, { Schema } from 'mongoose'

const ReviewSchema = new Schema({
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    picture_cover_url: String,
    content_list: [],
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_list: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    like_by_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rating: Number,
    timestamp: { type: Date, default: Date.now }

})

export default Mongoose.model('Review', ReviewSchema);
