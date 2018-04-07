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

	app.route('/currentuser')
		.get(UserController.getCurrentUser)
		.put(UserController.editUserInfo)
	app.route('/currentuser/ownpostlist')
		.get(UserController.getCurrentUserOwnPostList)
	app.route('/currentuser/savepostlist')
		.get(UserController.getCurrentUserSavePostList)
	app.route('/currentuser/follower')
		.get(UserController.getCurrentUserFollower)
	app.route('/currentuser/following')
		.get(UserController.getCurrentUserFollowing)

	app.route('/users/:id')
		.get(UserController.getUser)
	app.route('/users/:id/ownpostlist')
		.get(UserController.getUserOwnPostList)
	app.route('/users/:id/savepostlist')
		.get(UserController.getUserSavePostList)
	app.route('/users/:id/follower')
		.get(UserController.getUserFollower)
	app.route('/users/:id/following')
		.get(UserController.getUserFollowing)

	// current user follow this user id
	app.route('/users/:id/follow')
		.put(UserController.followUser)

	// current user unfollow this user id
	app.route('/users/:id/unfollow')
		.put(UserController.unfollowUser)

	app.route('/users/:id/reviews')
		.get(ReviewController.getUserReviews)

	app.route('/reviews/following')
		.get(ReviewController.getReviewByFollowing)

	app.route('/users/:id/reviews/following')
		.get(ReviewController.getReviewByUserFollowing)

	app.route('/reviews')
		.get(ReviewController.getReviewList)
		.post(ReviewController.createReview)

	app.route('/reviews/:id')
		.post(CommentController.createComment)
		.get(ReviewController.getReview)
		.delete(ReviewController.deleteReview)
		.put(ReviewController.editReview)

	app.route('/reviews/:id/save')
		.put(ReviewController.saveReview)

	app.route('/reviews/:id/unsave')
		.put(ReviewController.unSaveReview)

	app.route('/reviews/:id/comments')
		.get(CommentController.getReviewCommentList)

	app.route('/reviews/:id/comments/:cid')
		.put(CommentController.editComment)
		.delete(CommentController.deleteComment)

	app.route('/comments')
		.get(CommentController.getCommentList)
}
