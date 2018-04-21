import User from '../models/userModel'
import Review from '../models/reviewModel'

export default {
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

	getCurrentUserFollowingReview: (req, res) => User.find({ _id: req.session.user_id })
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			Review.find(
				{
					$or: [
						{ user: { $in: currentUser[0].following_list } },
						{ user: currentUser[0]._id }
					],
					available: true
				})
				.populate('user', 'name picture_url')
				.populate('product')
				.lean().exec((err, reviewList) => {
					if (err) res.send(err)
					res.json(reviewList)
				})
		}),

	getPageCurrentUserFollowingReview: (req, res) => User.find({ _id: req.session.user_id })
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			Review.paginate(
				{
					$or: [
						{ user: { $in: currentUser[0].following_list } },
						{ user: currentUser[0]._id }
					],
					available: true
				},
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, 'product']
				}, (err, review) => {
					if (err) res.send(err)
					res.send(review)
				})
		}),

	getUserFollowingReview: (req, res) => User.find({ _id: req.params.id })
		.lean().exec((err, user) => {
			if (err) res.send(err)
			Review.find(
				{
					$or: [
						{ user: { $in: user[0].following_list } },
						{ user: user[0]._id }
					],
					available: true
				})
				.populate('user', 'name picture_url')
				.populate('product')
				.lean().exec((err, reviewList) => {
					if (err) res.send(err)
					res.json(reviewList)
				})
		}),

	getPageUserFollowingReview: (req, res) => User.find({ _id: req.params.id })
		.lean().exec((err, user) => {
			if (err) res.send(err)
			Review.paginate(
				{
					$or: [
						{ user: { $in: user[0].following_list } },
						{ user: user[0]._id }
					],
					available: true
				},
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, 'product']
				}, (err, review) => {
					if (err) res.send(err)
					res.send(review)
				})
		})
}
