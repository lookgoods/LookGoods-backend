import Mongoose from 'mongoose'
import Review from '../models/reviewModel'
import Product from '../models/productModel'
import User from '../models/userModel'

export default {
    // createProduct: (req, res) => {
    //     const newProduct = new Product(req.body)
    //     newProduct.save((err, product) => {
    //         if (err) res.send(err)
    //         res.json(product)
    //     })
    // },
    
    // getProductList: (req, res) => Product.find({}, (err,productList) => {
    //     if (err) res.send(err)
    //     res.json(productList)
    // }),

    getReviewList: (req, res) => Review.find({}, (err, reviewList) => {
        if (err) res.send(err)
        res.json(reviewList)
    }),
    
    getUserReviews: (req, res) => Review.find({user:req.params.id}, (err, reviewList) =>{
        if (err) res.send(err)
        res.json(reviewList)
    }),

    createReview: (req, res) => Product.find({name:req.body.name}, (err, product) => {
        if (err) res.send(err)
        if (product.length == 0){
            const productInfo = {
                name: req.body.name,
                price: req.body.price,
                tag: req.body.tag,
                brand: req.body.brand
            }
            const newProduct = new Product(productInfo)
            newProduct.save((err, product) => {
                if (err) res.send(err)
                const reviewInfo = {
                    user: req.session.user_id,
                    title: req.body.title,
                    picture_cover_url: req.body.picture_cover_url,
                    content_list: req.body.content_list,
                    product_id: product._id,
                    comment_list: req.body.comment_list,
                    like_by_list: req.body.like_by_list,
                    rating: req.body.rating
                }
                const newReview = new Review(reviewInfo)
                newReview.save((err, review) => {
                    if (err) res.send(err)
                    console.log(review)
                    User.update({_id:req.session.user_id},{
                        $push: {own_post_list: review._id}
                    }, (err, updated) => {
                        if (err) res.send(err)
                        res.json(updated)
                    })
                })
            })
        }else{
            const reviewInfo = {
                user: req.session.user_id,
                title: req.body.title,
                picture_cover_url: req.body.picture_cover_url,
                content_list: req.body.content_list,
                product_id: product._id,
                comment_list: req.body.comment_list,
                like_by_list: req.body.like_by_list,
                rating: req.body.rating
            }
            const newReview = new Review(reviewInfo)
            newReview.save((err, review) => {
                if (err) res.send(err)
                console.log(review)
                User.update({_id:req.session.user_id},{
                    $push: {own_post_list: review._id}
                }, (err, updated) => {
                    if (err) res.send(err)
                    res.json(updated)
                })
            })
        }
            
    }),

    deleteReview: (req, res) => Review.remove({_id:req.params.id} ,(err ,removed) => {
        if (err) res.send(err)
        res.send(removed)
    })

}