import UserController from '../controllers/userController'
import ReviewController from '../controllers/reviewController'
import CommentController from '../controllers/commentController'
import Passport from '../models/auth'
import User from '../models/userModel'

export default app => {

    app.post('/auth/facebook/token',
        Passport.authenticate('facebook-token'),
        function (req, res) {
            User.find({client_id:req.session.passport.user.id}, (err, user) => {
                if (err) res.send(err)
                req.session.user_id = user[0]._id
                req.session.save()
            })
            res.send(req.user? 200 : 401)
        }
    )

    app.route('/users')
    .get(UserController.getUserList)
    .post(UserController.createUser)
    .put(UserController.changeUserInfo)

    app.route('/users/:id')
    .get(UserController.getUserInfo)

    app.route('/users/:id/follow')
    .put(UserController.followUser)

    app.route('/users/:id/follower')
    .get(UserController.getFollower)

    app.route('/users/:id/following')
    .get(UserController.getFollowing)

    app.route('/users/:id/unfollow')
    .put(UserController.unfollowUser)
    
    app.route('/users/:id/reviews')
    .get(ReviewController.getUserReviews)

    app.route('/currentuser')
    .get(UserController.getCurrentUser)
    

    app.route('/reviews')
    .get(ReviewController.getReviewList)
    .post(ReviewController.createReview)

    app.route('/reviews/:id')
    .post(CommentController.createComment)
    .get(CommentController.getCommentList)
    .delete(ReviewController.deleteReview)

    app.route('/reviews/:id/comments/:cid')
    .put(CommentController.changeCommentInfo)
    .delete(CommentController.deleteComment)


}