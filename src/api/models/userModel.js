import Mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    id_user: Schema.Types.ObjectId,
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: String,
    picture_url: String,
    number_of_posts: {type: Number,default: 0},
    number_of_reviews: {type: Number,default: 0},
    number_of_follower: {type: Number,default: 0},
    number_of_following: {type: Number,default: 0},
    list_follower: [],
    list_following: [],
    list_saved_post: [],
    list_owner_post: []

})

export default Mongoose.model('User', UserSchema);
