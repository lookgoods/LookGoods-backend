import Review from '../models/reviewModel'
import Comment from '../models/commentModel'
import User from '../models/userModel'

export default {
	createComment: (req, res) => {
		const commentInfo = {
			user: req.session.user_id,
			description: req.body.description,
			rating: req.body.rating
		}
		const newComment = new Comment(commentInfo)
		newComment.save((err, comment) => {
			if (err) res.send(err)
			Review.update(
				{
					_id: req.params.id
				}, {
					$push: { comment_list: comment._id }
				}, (err, updatedReview) => {
					if (err) res.send(err)
					User.update(
						{
							_id: req.session.user_id
						}, {
							$push: { comment_list: comment._id }
						}, (err, updateUser) => {
							if (err) res.send(err)
							User.update(
								{
									following_list: req.session.user_id
								}, {
									$push: { notification: { kind: 'Comment', item: comment._id } }
								}, (err, notificationUpdated) => {
									if (err) res.send(err)
									res.send(comment)
								}
							)
						}
					)
				}
			)
		})
	},

	getReviewCommentList: (req, res) => Review.find({ _id: req.params.id })
		.populate('comment_list')
		.populate({path: 'comment_list', populate: {path: 'user'}})
		.exec((err, review) => {
			if (err) res.send(err)
			res.send(review[0].comment_list)
		}),

	editComment: (req, res) => Comment.update(
		{
			_id: req.params.cid,
			user: req.session.user_id
		}, {
			description: req.body.description,
			rating: req.body.rating
		}, (err, updated) => {
			if (err) res.send(err)
			res.send(updated)
		}),

	deleteComment: (req, res) => Comment.find(
		{
			_id: req.params.cid,
			user: req.session.user_id
		}, (err, comment) => {
			if (err) res.send(err)
			if (comment.length === 0) {
				res.send(comment)
			} else {
				Review.update(
					{
						_id: req.params.id
					}, {
						$pull: { comment_list: req.params.cid }
					}, (err, updatedReview) => {
						if (err) res.send(err)
						User.update(
							{
								_id: req.session.user_id
							}, {
								$pull: { comment_list: req.params.cid }
							}, (err, updateUser) => {
								if (err) res.send(err)
								Comment.remove({ _id: req.params.cid }, (err, updated) => {
									if (err) res.send(err)
									res.send(updated)
								})
							}
						)
					}
				)
			}
		}
	)
}
