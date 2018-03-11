import Mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    client_id: String,
    name: String,
    picture_url: String,
    follower_list: [],
    following_list: [],
    saved_post_list: [],
    own_post_list: [],
    description: String

})

export default Mongoose.model('User', UserSchema);
