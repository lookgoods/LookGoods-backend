import Mongoose from 'mongoose'
import User from '../models/userModel'

export default {
    createUser: (req,res) => {
        const newUser = new User(req.body)
        newUser.save((err, user) => {
          if (err) res.send(err)
          res.json(user)
        })
    },

    getUserList: (req, res) => User.find({})
        .populate('own_post_list')
        .exec( (err, user) => {
            if (err) res.send(err)
            res.json(user)
    }),

    getUser: (req, res) => User.find({ _id:req.params.id })
        .populate('follower_list')
        .populate('following_list')
        .populate('saved_post_list')
        .populate('own_post_list')
        .exec( (err, user) => {
            if (err) res.send(err)
            res.json(user[0])
    }),

    editUserInfo: (req, res) => User.update(
        {
            _id:req.session.user_id
        }, {
            description: req.body.description
        }, (err, user) => {
            if (err) res.send(err)
            res.send(user)
    }),

    getCurrentUser: (req, res) => User.find({ _id:req.session.user_id })
        .populate('follower_list')
        .populate('following_list')
        .populate('saved_post_list')
        .populate('own_post_list')
        .exec( (err,currentUser) =>{
            if (err) res.send(err)
            res.json(currentUser[0])
    }),

    getFollower: (req, res) => User.find({ _id:req.params.id } ,(err, user) => {
        if (err) res.send(err)
        User.find({_id:{ $in: user[0].follower_list}}, (err, user_list) => {
            if (err) res.send(err)
            res.json(user_list)
        })
    }),

    getFollowing: (req, res) => User.find({ _id:req.params.id } ,(err, user) => {
        if (err) res.send(err)
        User.find({_id:{ $in: user[0].following_list}}, (err, user_list) => {
            if (err) res.send(err)
            res.json(user_list)
        })
    }),

    followUser: (req, res) => User.find(
        {
            _id:req.session.user_id, 
            following_list:req.params.id
        }, (err, currentUser) => {
            if (err) res.send(err)
            if (currentUser.length == 0){
                User.update(
                    {
                        _id:req.params.id
                    }, {
                        $push: { follower_list: req.session.user_id }
                    }, (err, updateFollower) => {
                        if (err) res.send(err)
                        User.update(
                            {
                                _id:req.session.user_id
                            }, {
                                $push: { following_list: req.params.id }
                            }, (err, updateFollowing) => {
                                if (err) res.send(err)
                                res.send(updateFollowing)
                            }
                        )
                    }
                )
            }else{
                res.json(currentUser)
            }
    }),

    unfollowUser: (req, res) => User.find(
        {
            _id:req.session.user_id, 
            following_list:req.params.id
        }, (err, currentUser) => {
            if (err) res.send(err)
            if (currentUser.length == 0){
                res.json(currentUser)
            }else{
                User.update(
                    {
                        _id:req.params.id
                    }, {
                        $pull: { follower_list: req.session.user_id }
                    }, (err, updateFollower) => {
                        if (err) res.send(err)
                        User.update(
                            {
                                _id:req.session.user_id
                            }, {
                                $pull: {following_list: req.params.id}
                            }, (err, updateFollowing) => {
                                if (err) res.sond(err)
                                res.send(updateFollowing)
                            }
                        )
                    }
                )
            }
    })
    
    
    

    
    
}