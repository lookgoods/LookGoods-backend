import Review from '../models/reviewModel'
import Chat from '../models/chatModel'
import User from '../models/userModel'

export default {
	createChat: (req, res) => {
		const chatInfo = {
			user: req.session.user_id,
			description: req.body.description
		}
		const newChat = new Chat(chatInfo)
		newChat.save((err, chat) => {
			if (err) res.send(err)
			Review.update(
				{
					_id: req.params.id
				}, {
					$push: { chat_list: chat._id }
				}, (err, updatedReview) => {
					if (err) res.send(updatedReview)
					User.update(
						{
							own_post_list: req.params.id
						}, {
							$push: { notification: { user: req.session.user_id, type: 'Chat', item: req.params.id } },
							$inc: { unread: 1 }
						}, (err, notificationUpdate) => {
							if (err) res.send(err)
							res.send(notificationUpdate)
						}
					)
				}
			)
		})
	},

	getReviewChatList: (req, res) => Review.find({ _id: req.params.id })
		.populate('chat_list')
		.populate({path: 'chat_list', populate: {path: 'user', select: 'name picture_url'}})
		.lean().exec((err, review) => {
			if (err) res.send(err)
			res.send(review[0].chat_list)
		}),

	getPageReviewChatList: (req, res) => Review.find({ _id: req.params.id })
		.exec((err, review) => {
			if (err) res.send(err)
			Chat.paginate({ _id: {$in: review[0].chat_list} },
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: {path: 'user', select: 'name picture_url'}
				}, (err, chatList) => {
					if (err) res.send(err)
					res.json(chatList)
				})
		}),

	editChat: (req, res) => Chat.update(
		{
			_id: req.params.cid,
			user: req.session.user_id
		}, {
			description: req.body.description
		}, (err, updateChat) => {
			if (err) res.send(err)
			res.send(updateChat)
		}
	),

	deleteChat: (req, res) => Chat.find(
		{
			_id: req.params.cid,
			user: req.session.user_id
		}
	).remove().exec((err, chat) => {
		if (err) res.send(err)
		Review.update(
			{
				_id: req.params.id
			}, {
				$pull: { chat_list: req.params.cid }
			}, (err, updateReview) => {
				if (err) res.send(err)
				res.send(updateReview)
			}
		)
	})

}
