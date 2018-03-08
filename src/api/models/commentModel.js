import Mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
    description: String,
    rating: Number,
    user_id: String, 
    timestamp: { type: Date, default: Date.now }

})

export default Mongoose.model('Comment', CommentSchema);
