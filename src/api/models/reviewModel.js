import Mongoose, { Schema } from 'mongoose'

const ReviewSchema = new Schema({
    id_review: Schema.Types.ObjectId,
    id_reviewer: String,
    id_post: String,
    description: String,
    rating_by_reviewer: Number

})

export default Mongoose.model('Review', ReviewSchema);
