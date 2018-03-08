import UserController from '../controllers/userController'
import ReviewController from '../controllers/reviewController'

export default app => {
    app.route('/users')
    .get(UserController.getUserList)
    .post(UserController.createUser)

    app.route('/reviews')
    .get(ReviewController.getProductList)
    .post(ReviewController.createProduct)
}