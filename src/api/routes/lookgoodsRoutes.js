import UserController from '../controllers/userController'
import ReviewController from '../controllers/reviewController'
import Passport from '../models/auth'

export default app => {

    app.post('/auth/facebook/token',
        Passport.authenticate('facebook-token'),
        function (req, res) {
            // do something with req.user
            res.send(req.user? 200 : 401);
        }
    )

    app.route('/users')
    .get(UserController.getUserList)
    .post(UserController.createUser)

    app.route('/users/:id')
    .get(UserController.getUserInfo)
    
  

    app.route('/reviews')
    .get(ReviewController.getReviewList)
    .post(ReviewController.createReview)


    // app.route('/products')
    // .get(ReviewController.getProductList)
}