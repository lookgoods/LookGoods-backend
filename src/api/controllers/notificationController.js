import User from '../models/userModel'

export default{
	getCurrentUserNotification: (req, res) => User.find({ _id: req.session.user_id })
		.populate('notification.item', 'title picture_cover_url timestamp')
		.populate('notification.user', 'name picture_url')
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.send(currentUser[0].notification)
		}),

	deleteCurrentUserNotificaion: (req, res) => User.update(
		{
			_id: req.session.user_id
		}, {
			$pull: {notification: {item: req.params.id}}
		}, (err, deleted) => {
			if (err) res.send(err)
			res.send(deleted)
		})
}
