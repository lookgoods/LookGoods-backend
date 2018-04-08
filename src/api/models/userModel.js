import Mongoose, { Schema } from 'mongoose'

const subNotification = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	type: String,
	item: { type: Schema.Types.ObjectId, ref: 'Review' }
}, { _id: false })

const UserSchema = new Schema({
	client_id: String,
	name: String,
	picture_url: String,
	follower_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	following_list: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	saved_post_list: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
	own_post_list: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
	comment_list: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	notification: [subNotification],
	description: String
})

export default Mongoose.model('User', UserSchema)
