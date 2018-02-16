import UserController from '../controllers/userController'

export default app => {
    app.route('/users')
    .get(UserController.listAllUsers)
    .post(UserController.createUser)
}