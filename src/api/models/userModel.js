import Mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    access_token: String,
    follower_list: [],
    following_list: [],
    saved_post_list: [],
    own_post_list: [],
    description: String

})

export default Mongoose.model('User', UserSchema);
