import CommentController from '../controllers/commentController'
import Passport from '../models/auth'
import ReviewController from '../controllers/reviewController'
import User from '../models/userModel'
import UserController from '../controllers/userController'
import SearchController from '../controllers/searchController'
import FollowController from '../controllers/followController'
import NotificationController from '../controllers/notificationController'
import ChatController from '../controllers/chatController'
import { sendUploadToGCS } from 'api/controllers/uploadController'
import Multer from 'multer'

const upload = Multer({
	storage: Multer.memoryStorage()
})

export default app => {
	app.post('/auth/facebook/token',
		Passport.authenticate('facebook-token'),
		function (req, res) {
			User.find({client_id: req.session.passport.user.id}, (err, user) => {
				if (err) res.send(err)
				req.session.user_id = user[0]._id
				req.session.save()
			})
			res.send(req.user ? 200 : 401)
		}
	)

	app.post('/uploadImage', upload.single('file'), (req, res, next) => {
		sendUploadToGCS(req, res, next)
	})

	app.route('/users')
		.get(UserController.getUserList)
		.post(UserController.createUser)
	app.route('/users/pages/:pid/:psize')
		.get(UserController.getPageUserList)

	app.route('/currentuser')
		.get(UserController.getCurrentUser)
		.put(UserController.editUserInfo)
	app.route('/currentuser/ownpostlist')
		.get(UserController.getCurrentUserOwnPostList)
	app.route('/currentuser/ownpostlist/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserOwnPostList)
	app.route('/currentuser/savepostlist')
		.get(UserController.getCurrentUserSavePostList)
	app.route('/currentuser/savepostlist/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserSavePostList)
	app.route('/currentuser/follower')
		.get(UserController.getCurrentUserFollower)
	app.route('/currentuser/follower/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserFollower)
	app.route('/currentuser/following')
		.get(UserController.getCurrentUserFollowing)
	app.route('/currentuser/following/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserFollower)
	app.route('/currentuser/comments')
		.get(UserController.getCurrentUserCommentList)
	app.route('/currentuser/comments/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserCommentList)

	app.route('/currentuser/notifications')
		.get(NotificationController.getCurrentUserNotification)
		.put(NotificationController.updateNotification)
	app.route('/currentuser/notifications/:id')
		.delete(NotificationController.deleteCurrentUserNotificaion)

	app.route('/currentuser/follow/users/:id')
		.put(FollowController.followUser)
	app.route('/currentuser/unfollow/users/:id')
		.put(FollowController.unfollowUser)
	app.route('/currentuser/following/reviews')
		.get(FollowController.getCurrentUserFollowingReview)
	app.route('/currentuser/following/reviews/pages/:pid/:psize')
		.get(FollowController.getPageCurrentUserFollowingReview)
	app.route('/users/:id/following/reviews')
		.get(FollowController.getUserFollowingReview)
	app.route('/users/:id/following/reviews/pages/:pid/:psize')
		.get(FollowController.getPageUserFollowingReview)

	app.route('/users/:id')
		.get(UserController.getUser)
	app.route('/users/:id/ownpostlist')
		.get(UserController.getUserOwnPostList)
	app.route('/users/:id/ownpostlist/pages/:pid/:psize')
		.get(UserController.getPageUserOwnPostList)
	app.route('/users/:id/savepostlist')
		.get(UserController.getUserSavePostList)
	app.route('/users/:id/savepostlist/pages/:pid/:psize')
		.get(UserController.getPageUserSavePostList)
	app.route('/users/:id/follower')
		.get(UserController.getUserFollower)
	app.route('/users/:id/follower/pages/:pid/:psize')
		.get(UserController.getPageUserFollower)
	app.route('/users/:id/following')
		.get(UserController.getUserFollowing)
	app.route('/users/:id/following/pages/:pid/:psize')
		.get(UserController.getPageUserFollowing)
	app.route('/users/:id/comments')
		.get(UserController.getUserCommentList)
	app.route('/users/:id/comments/pages/:pid/:psize')
		.get(UserController.getPageUserCommentList)

	app.route('/reviews')
		.post(ReviewController.createReview)
		.get(ReviewController.getReviewList)
	app.route('/reviews/pages/:pid/:psize')
		.get(ReviewController.getPageReviewList)

	app.route('/reviews/:id')
		.get(ReviewController.getReview)
		.put(ReviewController.editReview)
		.delete(ReviewController.deleteReview)

	app.route('/reviews/:id/save')
		.put(ReviewController.saveReview)
	app.route('/reviews/:id/unsave')
		.put(ReviewController.unSaveReview)
	app.route('/reviews/:id/like')
		.put(ReviewController.likeReview)
	app.route('/reviews/:id/unlike')
		.put(ReviewController.unlikeReview)

	app.route('/reviews/:id/comments')
		.get(CommentController.getReviewCommentList)
		.post(CommentController.createComment)
	app.route('/reviews/:id/comments/pages/:pid/:psize')
		.get(CommentController.getPageReviewCommentList)
	app.route('/reviews/:id/comments/:cid')
		.put(CommentController.editComment)
		.delete(CommentController.deleteComment)

	app.route('/reviews/:id/chats')
		.get(ChatController.getReviewChatList)
		.post(ChatController.createChat)
	app.route('/reviews/:id/chats/pages/:pid/:psize')
		.get(ChatController.getPageReviewChatList)
	app.route('/reviews/:id/chats/:cid')
		.put(ChatController.editChat)
		.delete(ChatController.deleteChat)

	app.route('/search/users')
		.post(SearchController.searchUser)
	app.route('/search/users/pages/:pid/:psize')
		.post(SearchController.searchPageUser)
	app.route('/search/reviews/tag')
		.post(SearchController.searchReviewByTag)
	app.route('/search/reviews/tag/pages/:pid/:psize')
		.post(SearchController.searchPageReviewByTag)
	app.route('/search/reviews')
		.post(SearchController.searchReviewByTitle)
	app.route('/search/reviews/pages/:pid/:psize')
		.post(SearchController.searchPageReviewByTitle)
	app.route('/search/reviews/products')
		.post(SearchController.searchReviewByProduct)
	app.route('/search/reviews/products/pages/:pid/:psize')
		.post(SearchController.searchPageReviewByProduct)
	app.route('/search/products')
		.post(SearchController.searchProductName)
}
