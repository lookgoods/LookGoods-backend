import Mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
    description: String,
    rating: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' }, 
    timestamp: { type: Date, default: Date.now }

})

export default Mongoose.model('Comment', CommentSchema);
