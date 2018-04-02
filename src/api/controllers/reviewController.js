import Mongoose from 'mongoose'
import Review from '../models/reviewModel'
import Product from '../models/productModel'
import User from '../models/userModel'

export default {

	getReviewList: (req, res) => Review.find({})
		.populate('user')
		.populate('product_id')
		.exec( (err, reviewList) => {
			if (err) res.send(err)
			res.json(reviewList)
	}),

	getReview: (req, res) => Review.find({_id:req.params.id})
		.populate('user')
		.populate('product_id')
		.exec((err, review) => {
			if (err) res.send(err)
			res.json(review[0])
	}),

	getUserReviews: (req, res) => Review.find({user: req.params.id})
		.populate('user')
		.populate('product_id')
		.exec((err, reviewList) => {
			if (err) res.send(err)
			res.json(reviewList)
	}),

	getReviewByFollowing: (req, res) => User.find({_id: req.session.user_id})
		.populate('own_post_list')
		.exec((err, currentUser) => {
			if (err) res.send(err)
			Review.find({user: { $in: currentUser[0].following_list }})
				.populate('user')
				.populate('product_id')
				.exec( (err, review_list) => {
					if (err) res.send(err)
					res.json(review_list)
				})
	}),

	getReviewByUserFollowing: (req, res) => User.find({_id: req.params.id})
		.populate('own_post_list')
		.exec( (err, user) => {
			if (err) res.send(err)
			Review.find({user: { $in: user[0].following_list }})
				.populate('user')
				.populate('product_id')
				.exec( (err, review_list) => {
					if (err) res.send(err)
					res.json(review_list)
				})
	}),

	createReview: (req, res) => Product.find({name: req.body.name})
		.exec((err, product) => {
			if (err) res.send(err)
			if (product.length === 0) {
				const productInfo = {
					name: req.body.name,
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
						picture_thumbnail_url: req.body.picture_thumbnail_url,
						content_list: req.body.content_list,
						product_id: product._id,
						price: req.body.price,
						comment_list: req.body.comment_list,
						like_by_list: req.body.like_by_list,
						rating: req.body.rating,
						available: 1
					}
					const newReview = new Review(reviewInfo)
					newReview.save((err, review) => {
						if (err) res.send(err)
						User.update({_id: req.session.user_id}, {
							$push: {own_post_list: review._id}
						}, (err, updated) => {
							if (err) res.send(err)
							res.json(review)
						})
					})
				})
			} else {
				const reviewInfo = {
					user: req.session.user_id,
					title: req.body.title,
					picture_cover_url: req.body.picture_cover_url,
					picture_thumbnail_url: req.body.picture_thumbnail_url,
					content_list: req.body.content_list,
					product_id: product[0]._id,
					comment_list: req.body.comment_list,
					like_by_list: req.body.like_by_list,
					rating: req.body.rating,
					available: 1
				}
				const newReview = new Review(reviewInfo)
				newReview.save((err, review) => {
					if (err) res.send(err)
					User.update({_id: req.session.user_id}, {
						$push: {own_post_list: review._id}
					}, (err, updated) => {
						if (err) res.send(err)
						res.json(review)
					})
				})
			}
	}),

	deleteReview: (req, res) => Review.update(
		{
			_id: req.params.id,
			user: req.session.user_id
		}, {
			available: 0
		}, (err, updated) => {
			if (err) res.send(err)
			if (updated.nModified === 0) {
				res.send(updated)
			} else {
				User.update(
					{
						_id: req.session.user_id
					}, {
						$pull: { own_post_list: req.params.id }
					}, (err, updated) => {

					if (err) res.send(err)
					res.send(updated)
				})
			}
		}
	),

	editReview: (req, res) => Product.find({name: req.body.name})
		.exec( (err, product) => {
			if (err) res.send(err)
			if (product.length === 0) {
				const productInfo = {
					name: req.body.name,
					tag: req.body.tag,
					brand: req.body.brand
				}
				const newProduct = new Product(productInfo)
				newProduct.save((err, product) => {
					if (err) res.send(err)
					Review.update({
						_id: req.params.id,
						user: req.session.user_id
					}, {
						title: req.body.title,
						picture_cover_url: req.body.picture_cover_url,
						picture_thumbnail_url: req.body.picture_thumbnail_url,
						content_list: req.body.content_list,
						product_id: product._id,
						price: req.body.price,
						rating: req.body.rating,
						available: 1
					}, (err, updated) => {
						if (err) res.send(err)
						res.send(updated)
					})
				})
			} else {
				Review.update({
					_id: req.params.id,
					user: req.session.user_id
				}, {
					title: req.body.title,
					picture_cover_url: req.body.picture_cover_url,
					picture_thumbnail_url: req.body.picture_thumbnail_url,
					content_list: req.body.content_list,
					product_id: product[0]._id,
					price: req.body.price,
					rating: req.body.rating,
					available: 1
				}, (err, updated) => {
					if (err) res.send(err)
					res.send(updated)
				})
			}
    })

}
