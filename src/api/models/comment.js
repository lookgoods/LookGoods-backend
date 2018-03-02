import Mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
    id_comment: Schema.Types.ObjectId,
    description: String,
    rating: number

})

export default Mongoose.model('Comment', CommentSchema);
