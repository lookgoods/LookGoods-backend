import Mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
	client_id: String,
	name: String,
	picture_url: String,
	follower_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	following_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	saved_post_list: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
	own_post_list: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
	comment_list: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	// notification: [{ kind: String, item: { type: Schema.Types.ObjectId, refPath: 'notification.kind' } }],
	description: String
})

export default Mongoose.model('User', UserSchema)
