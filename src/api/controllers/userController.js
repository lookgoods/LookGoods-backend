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
		.exec((err, user) => {
			if (err) res.send(err)
			res.json(user)
		}),

	getUser: (req, res) => User.find({ _id: req.params.id })
		.exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0])
		}),

	getCurrentUser: (req, res) => User.find({ _id: req.session.user_id })
		.exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0])
		}),

	getUserSavePostList: (req, res) => User.find({ _id: req.params.id })
		.populate('saved_post_list')
		.populate({path: 'saved_post_list', populate: {path: 'user'}})
		.populate({path: 'saved_post_list', populate: {path: 'product'}})
		.exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0].save_post_list)
		}),

	getCurrentUserSavePostList: (req, res) => User.find({ _id: req.session.user_id })
		.populate('saved_post_list')
		.populate({path: 'saved_post_list', populate: {path: 'user'}})
		.populate({path: 'saved_post_list', populate: {path: 'product'}})
		.exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0].save_post_list)
		}),

	getUserOwnPostList: (req, res) => User.find({ _id: req.params.id })
		.populate('own_post_list')
		.populate({path: 'own_post_list', populate: {path: 'user'}})
		.populate({path: 'own_post_list', populate: {path: 'product'}})
		.exec((err, user) => {
			if (err) res.send(err)
			res.json(user[0].own_post_list)
		}),

	getCurrentUserOwnPostList: (req, res) => User.find({ _id: req.session.user_id })
		.populate('own_post_list')
		.populate({path: 'own_post_list', populate: {path: 'user'}})
		.populate({path: 'own_post_list', populate: {path: 'product'}})
		.exec((err, currentUser) => {
			if (err) res.send(err)
			res.json(currentUser[0].own_post_list)
		}),

	getUserFollower: (req, res) => User.find({ _id: req.params.id }, (err, user) => {
		if (err) res.send(err)
		User.find({_id: { $in: user[0].follower_list }}, (err, userList) => {
			if (err) res.send(err)
			res.json(userList)
		})
	}),

	getCurrentUserFollower: (req, res) => User.find({ _id: req.session.user_id }, (err, currentUser) => {
		if (err) res.send(err)
		User.find({_id: { $in: currentUser[0].follower_list }}, (err, userList) => {
			if (err) res.send(err)
			res.json(userList)
		})
	}),

	getUserFollowing: (req, res) => User.find({ _id: req.params.id }, (err, user) => {
		if (err) res.send(err)
		User.find({_id: { $in: user[0].following_list }}, (err, userList) => {
			if (err) res.send(err)
			res.json(userList)
		})
	}),

	getCurrentUserFollowing: (req, res) => User.find({ _id: req.session.user_id }, (err, currentUser) => {
		if (err) res.send(err)
		User.find({_id: { $in: currentUser[0].following_list }}, (err, userList) => {
			if (err) res.send(err)
			res.json(userList)
		})
	}),

	followUser: (req, res) => User.find(
		{
			_id: req.session.user_id,
			following_list: req.params.id
		}, (err, currentUser) => {
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
		}, (err, currentUser) => {
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
		})
}
