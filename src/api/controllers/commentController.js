import Mongoose from 'mongoose'
import Review from '../models/reviewModel'
import Comment from '../models/commentModel'

export default {
    createComment: (req, res) => {
        const commentInfo = {
            user: req.session.user_id,
            description: req.body.description,
            rating: req.body.rating
        }
        const newComment = new Comment(commentInfo)
        newComment.save((err, comment) => {
            if (err) res.send(err)
            Review.update({_id:req.params.id}, {
               $push: {comment_list:comment._id} 
            }, (err, updatedComment) => {
                if (err) res.send(err)
                res.send(updatedComment)
            })
        })
    },

    getCommentList: (req, res) => Review.find({_id:req.params.id}, (err, review) => {
        if (err) res.send(err)
        res.json(review[0].comment_list)
    })
    
    
}