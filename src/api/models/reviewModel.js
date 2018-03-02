import Mongoose, { Schema } from 'mongoose'

const ReviewSchema = new Schema({
    id_review: Schema.Types.ObjectId,
    id_user: String,
    picture_cover_url: String,
    content_list: [],
    product_id: String,
    comment_list: [],
    like_by_list: [],
    rating: number

})

export default Mongoose.model('Review', ReviewSchema);
