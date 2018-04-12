import CommentController from '../controllers/commentController'
import Passport from '../models/auth'
import ReviewController from '../controllers/reviewController'
import User from '../models/userModel'
import UserController from '../controllers/userController'
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
	app.route('/currentuser/follow/users/:id')
		.put(UserController.followUser)
	app.route('/currentuser/unfollow/users/:id')
		.put(UserController.unfollowUser)
	app.route('/currentuser/follower')
		.get(UserController.getCurrentUserFollower)
	app.route('/currentuser/follower/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserFollower)
	app.route('/currentuser/following')
		.get(UserController.getCurrentUserFollowing)
	app.route('/currentuser/following/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserFollower)
	app.route('/currentuser/following/reviews')
		.get(ReviewController.getCurrentUserFollowingReview)
	app.route('/currentuser/following/reviews/pages/:pid/:psize')
		.get(ReviewController.getPageCurrentUserFollowingReview)
	app.route('/currentuser/comments')
		.get(UserController.getCurrentUserCommentList)
	app.route('/currentuser/comments/pages/:pid/:psize')
		.get(UserController.getPageCurrentUserCommentList)
	app.route('/currentuser/notifications')
		.get(UserController.getCurrentUserNotification)
	app.route('/currentuser/notifications/:id')
		.delete(UserController.deleteCurrentUserNotificaion)

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
	app.route('/users/:id/following/reviews')
		.get(ReviewController.getUserFollowingReview)
	app.route('/users/:id/following/reviews/pages/:pid/:psize')
		.get(ReviewController.getPageUserFollowingReview)
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

	app.route('/search/users')
		.post(UserController.searchUser)
	app.route('/search/reviews/tag')
		.post(ReviewController.searchReviewByTag)
	app.route('/search/reviews')
		.post(ReviewController.searchReviewByTitle)
	app.route('/search/reviews/products')
		.post(ReviewController.searchReviewByProduct)

	app.route('/search/products')
		.post(ReviewController.searchProductName)
	app.route('/search/products/pages/:pid/:psize')
		.post(ReviewController.searchPageProductName)
}
