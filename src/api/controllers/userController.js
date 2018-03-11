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

    findOrCreateUser: (req,res) => User.findOne({client_id: req.body.id}, (err, user) =>{
        if (err) res.send(err)
        if (user == null){
            const userInfo = {
                client_id: req.body.id,
                name: req.body.name,
                picture_url: req.body.picture_url,
                follower_list: [],
                following_list: [],
                saved_post_list: [],
                own_post_list: [],
                description: req.body.description
            }
        }

        const query = {client_id: req.body.id}
        const update = {
            name: req.body.name,
            picture_url: req.body.picture_url,
            description: req.body.description
        }
        const options = {multi: false}
        User.update(query, update, options, (err, updateUser) => {
            if (err) res.send(err)
            res.json(updateUser)
        })
    })
    
}