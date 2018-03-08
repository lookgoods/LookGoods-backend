import Mongoose from 'mongoose'
import Review from '../models/reviewModel'
import Product from '../models/productModel'

export default {
    createProduct: (req, res) => {
        const newProduct = new Product(req.body)
        newProduct.save((err, product) => {
            if (err) res.send(err)
            res.json(product)
        })
    },
    
    getProductList: (req, res) => Product.find({}, (err,productList) => {
        if (err) res.send(err)
        res.json(productList)
    }),

    createReview: (req, res) => {
        const productInfo = {
            
        }
        const newProduct = new Product(productInfo)
        newProduct.save((err, product) => {
            if (err) res.send(err)
            const reviewInfo = {
                cover_url: req.body.cover_url,
                product_id: product.product_id
            }
            const newReview = new Review(reviewInfo)
            newReview.save((err, review) => {
                if (err) res.send(err)
                res.json(review)
            })
        })
        
    }
}