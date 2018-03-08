import Mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
    comment_id: Schema.Types.ObjectId,
    description: String,
    rating: Number,
    user_id: String, 
    timestamp: { type: Date, default: Date.now }

})

export default Mongoose.model('Comment', CommentSchema);
