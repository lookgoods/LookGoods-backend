import UserController from '../controllers/userController'
import ReviewController from '../controllers/reviewController'
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

    app.route('/users/:id')
    .get(UserController.getUserInfo)

    app.route('/currentuser')
    .get(UserController.getCurrentUser)
    

    app.route('/reviews')
    .get(ReviewController.getReviewList)
    .post(ReviewController.createReview)


    // app.route('/products')
    // .get(ReviewController.getProductList)
}