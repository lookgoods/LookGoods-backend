import Mongoose from 'mongoose'
import Product from '../models/productModel'

export default{
    createProduct: (req,res) => {
        const newProduct = new Product(req.body)
        newProduct.save((err, product) => {
            if (err) res.send(err)
            res.json(product)
        })
    }
}