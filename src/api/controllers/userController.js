import Mongoose from 'mongoose'
import User from '../models/userModel'

export default {
    listAllUsers: (req, res) => User.find({},(err, user) => {
        if (err) res.send(err)
        res.json(user)
    }),

    createUser: (req,res) => {
        const newUser = new User(req.body)
        newUser.save((err, user) => {
          if (err) res.send(err)
          res.json(user)
        })
    }
}