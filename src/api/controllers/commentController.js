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
									$push: { notification: { user: req.session.user_id, type: 'Comment', item: req.params.id } },
									$inc: { unread: 1 }
								}, { multi: true }, (err, notificationUpdated) => {
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
		.populate({path: 'comment_list', populate: {path: 'user', select: 'name picture_url'}})
		.lean().exec((err, review) => {
			if (err) res.send(err)
			res.send(review[0].comment_list)
		}),

	getPageReviewCommentList: (req, res) => Review.find({ _id: req.params.id })
		.exec((err, review) => {
			if (err) res.send(err)
			Comment.paginate({ _id: {$in: review[0].comment_list} },
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: {path: 'user', select: 'name picture_url'}
				}, (err, commentList) => {
					if (err) res.send(err)
					res.json(commentList)
				})
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
		}
	).remove().exec((err, comment) => {
		if (err) res.send(err)
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
						res.send(updateUser)
					}
				)
			}
		)
	})
}
