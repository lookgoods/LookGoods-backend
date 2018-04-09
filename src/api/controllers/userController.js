import User from '../models/userModel'

export default {
	createUser: (req, res) => {
		const newUser = new User(req.body)
		newUser.save((err, user) => {
			if (err) res.send(err)
			res.json(user)
		})
	},

	editUserInfo: (req, res) => User.update(
		{
			_id: req.session.user_id
		}, {
			description: req.body.description
		}, (err, currentUser) => {
			if (err) res.send(err)
			res.send(currentUser)
		}),

	getUserList: (req, res) => User.find({})
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.json(user)
		}),

	getUser: (req, res) => User.find({ _id: req.params.id })
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0])
		}),

	getCurrentUser: (req, res) => User.find({ _id: req.session.user_id })
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0])
		}),

	getUserSavePostList: (req, res) => User.find({ _id: req.params.id })
		.populate('saved_post_list')
		.populate({path: 'saved_post_list', populate: {path: 'user', select: 'name picture_url'}})
		.populate({path: 'saved_post_list', populate: {path: 'product'}})
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0].saved_post_list)
		}),

	getCurrentUserSavePostList: (req, res) => User.find({ _id: req.session.user_id })
		.populate('saved_post_list')
		.populate({path: 'saved_post_list', populate: {path: 'user', select: 'name picture_url'}})
		.populate({path: 'saved_post_list', populate: {path: 'product'}})
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0].saved_post_list)
		}),

	getUserOwnPostList: (req, res) => User.find({ _id: req.params.id })
		.populate('own_post_list')
		.populate({path: 'own_post_list', populate: {path: 'user', select: 'name picture_url'}})
		.populate({path: 'own_post_list', populate: {path: 'product'}})
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0].own_post_list)
		}),

	getCurrentUserOwnPostList: (req, res) => User.find({ _id: req.session.user_id })
		.populate('own_post_list')
		.populate({path: 'own_post_list', populate: {path: 'user', select: 'name picture_url'}})
		.populate({path: 'own_post_list', populate: {path: 'product'}})
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0].own_post_list)
		}),

	getUserCommentList: (req, res) => User.find({ _id: req.params.id })
		.populate('comment_list')
		.populate({path: 'comment_list', populate: {path: 'user', select: 'name picture_url'}})
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0].comment_list)
		}),

	getCurrentUserCommentList: (req, res) => User.find({ _id: req.session.user_id })
		.populate('comment_list')
		.populate({path: 'comment_list', populate: {path: 'user', select: 'name picture_url'}})
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0].comment_list)
		}),

	getUserFollower: (req, res) => User.find({ _id: req.params.id })
		.populate('follower_list', 'name picture_url')
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.send(user[0].follower_list)
		}),

	getCurrentUserFollower: (req, res) => User.find({ _id: req.session.user_id })
		.populate('follower_list', 'name picture_url')
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.send(currentUser[0].follower_list)
		}),

	getUserFollowing: (req, res) => User.find({ _id: req.params.id })
		.populate('following_list', 'name picture_url')
		.lean().exec((err, user) => {
			if (err) res.send(err)
			res.send(user[0].following_list)
		}),

	getCurrentUserFollowing: (req, res) => User.find({ _id: req.session.user_id })
		.populate('following_list', 'name picture_url')
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			res.send(currentUser[0].following_list)
		}),

	followUser: (req, res) => User.find(
		{
			_id: req.session.user_id,
			following_list: req.params.id
		})
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			if (currentUser.length === 0) {
				User.update(
					{
						_id: req.params.id
					}, {
						$push: { follower_list: req.session.user_id }
					}, (err, updateFollower) => {
						if (err) res.send(err)
						User.update(
							{
								_id: req.session.user_id
							}, {
								$push: { following_list: req.params.id }
							}, (err, updateFollowing) => {
								if (err) res.send(err)
								res.send(updateFollowing)
							}
						)
					}
				)
			} else {
				res.json(currentUser)
			}
		}),

	unfollowUser: (req, res) => User.find(
		{
			_id: req.session.user_id,
			following_list: req.params.id
		})
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			if (currentUser.length === 0) {
				res.json(currentUser)
			} else {
				User.update(
					{
						_id: req.params.id
					}, {
						$pull: { follower_list: req.session.user_id }
					}, (err, updateFollower) => {
						if (err) res.send(err)
						User.update(
							{
								_id: req.session.user_id
							}, {
								$pull: {following_list: req.params.id}
							}, (err, updateFollowing) => {
								if (err) res.sond(err)
								res.send(updateFollowing)
							}
						)
					}
				)
			}
		}),

	getCurrentUserNotification: (req, res) => User.find({ _id: req.session.user_id })
		.populate('notification.item', 'title picture_cover_url')
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
