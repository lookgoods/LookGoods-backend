import Mongoose from 'mongoose'
import User from '../models/userModel'

export default {
    getUserList: (req, res) => User.find({}, (err, user) => {
        if (err) res.send(err)
        res.json(user)
    }),

    createUser: (req,res) => {
        const newUser = new User(req.body)
        newUser.save((err, user) => {
          if (err) res.send(err)
          res.json(user)
        })
    },

    getUserInfo: (req, res) => User.find({_id:req.params.id}, (err, user) => {
        if (err) res.send(err)
        res.json(user)
    }),

    changeUserInfo: (req, res) => User.update({_id:req.session.user_id}, {
        description: req.body.description
    }, (err, user) => {
        if (err) res.send(err)
        res.send(user)
    }),

    getCurrentUser: (req, res) => User.find({_id:req.session.user_id}, (err,currentUser) =>{
        if (err) res.send(err)
        res.json(currentUser)
    })

    
    
}