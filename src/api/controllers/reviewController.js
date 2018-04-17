import Review from '../models/reviewModel'
import Product from '../models/productModel'
import User from '../models/userModel'

export default {

	getReviewList: (req, res) => Review.find({ available: true })
		.populate('user', 'name picture_url')
		.populate('product')
		.lean().exec((err, review) => {
			if (err) res.send(err)
			res.json(review)
		}),

	getPageReviewList: (req, res) => Review.paginate({ available: true },
		{
			page: req.params.pid,
			limit: parseInt(req.params.psize, 10),
			populate: [{path: 'user', select: 'name picture_url'}, 'product']
		}, (err, reviewList) => {
			if (err) res.send(err)
			res.json(reviewList)
		}),

	getReview: (req, res) => Review.find({ _id: req.params.id })
		.populate('user', 'name picture_url')
		.populate('product')
		.lean().exec((err, review) => {
			if (err) res.send(err)
			res.json(review[0])
		}),

	getCurrentUserFollowingReview: (req, res) => User.find({ _id: req.session.user_id })
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			Review.find(
				{
					$or: [
						{ user: { $in: currentUser[0].following_list } },
						{ user: currentUser[0]._id }
					],
					available: true
				})
				.populate('user', 'name picture_url')
				.populate('product')
				.lean().exec((err, reviewList) => {
					if (err) res.send(err)
					res.json(reviewList)
				})
		}),

	getPageCurrentUserFollowingReview: (req, res) => User.find({ _id: req.session.user_id })
		.lean().exec((err, currentUser) => {
			if (err) res.send(err)
			Review.paginate(
				{
					$or: [
						{ user: { $in: currentUser[0].following_list } },
						{ user: currentUser[0]._id }
					],
					available: true
				},
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, 'product']
				}, (err, review) => {
					if (err) res.send(err)
					res.send(review)
				})
		}),

	getUserFollowingReview: (req, res) => User.find({ _id: req.params.id })
		.lean().exec((err, user) => {
			if (err) res.send(err)
			Review.find(
				{
					$or: [
						{ user: { $in: user[0].following_list } },
						{ user: user[0]._id }
					],
					available: true
				})
				.populate('user', 'name picture_url')
				.populate('product')
				.lean().exec((err, reviewList) => {
					if (err) res.send(err)
					res.json(reviewList)
				})
		}),

	getPageUserFollowingReview: (req, res) => User.find({ _id: req.params.id })
		.lean().exec((err, user) => {
			if (err) res.send(err)
			Review.paginate(
				{
					$or: [
						{ user: { $in: user[0].following_list } },
						{ user: user[0]._id }
					],
					available: true
				},
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, 'product']
				}, (err, review) => {
					if (err) res.send(err)
					res.send(review)
				})
		}),

	createReview: (req, res) => Product.find({ name: req.body.name, brand: req.body.brand })
		.exec((err, product) => {
			if (err) res.send(err)
			if (product.length === 0) {
				const productInfo = {
					name: req.body.name,
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
						product: product._id,
						price: req.body.price,
						comment_list: req.body.comment_list,
						like_by_list: req.body.like_by_list,
						rating: req.body.rating,
						available: 1,
						tag: req.body.tag
					}
					const newReview = new Review(reviewInfo)
					newReview.save((err, review) => {
						if (err) res.send(err)
						User.update(
							{
								_id: req.session.user_id
							}, {
								$push: { own_post_list: review._id }
							}, (err, updated) => {
								if (err) res.send(err)
								User.update(
									{
										following_list: req.session.user_id
									}, {
										$push: { notification: { user: req.session.user_id, type: 'Review', item: review._id } }
									}, { multi: true }, (err, userUpdated) => {
										if (err) res.send(err)
										res.send(review)
									})
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
					product: product[0]._id,
					comment_list: req.body.comment_list,
					like_by_list: req.body.like_by_list,
					rating: req.body.rating,
					available: 1,
					tag: req.body.tag
				}
				const newReview = new Review(reviewInfo)
				newReview.save((err, review) => {
					if (err) res.send(err)
					User.update(
						{
							_id: req.session.user_id
						}, {
							$push: { own_post_list: review._id }
						}, (err, updated) => {
							if (err) res.send(err)
							User.update(
								{
									following_list: req.session.user_id
								}, {
									$push: { notification: { user: req.session.user_id, type: 'Review', item: review._id } }
								}, { multi: true }, (err, userUpdated) => {
									if (err) res.send(err)
									res.json(review)
								})
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

	editReview: (req, res) => Product.find({name: req.body.name, brand: req.body.brand})
		.exec((err, product) => {
			if (err) res.send(err)
			if (product.length === 0) {
				const productInfo = {
					name: req.body.name,
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
						product: product._id,
						price: req.body.price,
						rating: req.body.rating,
						available: 1,
						tag: req.body.tag
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
					product: product[0]._id,
					price: req.body.price,
					rating: req.body.rating,
					available: 1,
					tag: req.body.tag
				}, (err, updated) => {
					if (err) res.send(err)
					res.send(updated)
				})
			}
		}),

	saveReview: (req, res) => Review.find({ _id: req.params.id })
		.exec((err, review) => {
			if (err) res.send(err)
			User.update(
				{
					_id: req.session.user_id
				}, {
					$push: { saved_post_list: req.params.id }
				}, (err, updated) => {
					if (err) res.send(err)
					res.send(updated)
				})
		}),

	unSaveReview: (req, res) => Review.find({ _id: req.params.id })
		.exec((err, review) => {
			if (err) res.send(err)
			User.update(
				{
					_id: req.session.user_id
				}, {
					$pull: { saved_post_list: req.params.id }
				}, (err, updated) => {
					if (err) res.send(err)
					res.send(updated)
				})
		}),

	likeReview: (req, res) => Review.update(
		{
			_id: req.params.id
		}, {
			$push: { like_by_list: req.session.user_id }
		}, (err, updated) => {
			if (err) res.send(err)
			res.send(updated)
		}),

	unlikeReview: (req, res) => Review.update(
		{
			_id: req.params.id
		}, {
			$pull: { like_by_list: req.session.user_id }
		}, (err, updated) => {
			if (err) res.send(err)
			res.send(updated)
		}),

	searchReviewByTag: (req, res) => Review.aggregate([
		// {
		// 	$match: { $text:
		// 	{
		// 		$search: req.body.key,
		// 		$caseSensitive: false
		// 	}
		// 	}
		// },
		{
			$project: {
				index: {
					$cond: [
						{
							$in: [req.body.key, '$tag']
						}, 1, -1
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, review) => {
			if (err) res.send(err)
			Review.populate(review, {path: '_id', populate: [{path: 'user', select: 'name picture_url'}, {path: 'product'}]}, (err, popObject) => {
				if (err) res.send(err)
				res.send(popObject)
			})
		}),

	searchPageReviewByTag: (req, res) => Review.aggregate([
		// {
		// 	$match: { $text:
		// 			{
		// 				$search: req.body.key,
		// 				$caseSensitive: false
		// 			}
		// 	}
		// },
		{
			$project: {
				index: {
					$cond: [
						{
							$in: [req.body.key, '$tag']
						}, 1, -1
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, review) => {
			if (err) res.send(err)
			Review.paginate(
				{
					_id: { $in: review }
				}, {
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, {path: 'product'}]
				}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchReviewByTitle: (req, res) => Review.aggregate([
		// {

		// 	$match: {
		// 		$or: [{
		// 			$text: {
		// 				$search: req.body.key,
		// 				$caseSensitive: false
		// 			}
		// 		}, {
		// 			title: { $regex: new RegExp(req.body.key.toLowerCase(), 'i') }
		// 		}]
		// 	}
		// },
		{
			$project: {
				index: {
					$cond: [
						{
							$in: [req.body.key, '$tag']
						}, 1, {$indexOfCP: [
							{
								$toLower: '$title'
							},
							{
								$toLower: req.body.key
							}
						]}
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, review) => {
			if (err) res.send(err)
			Review.populate(review,
				{path: '_id',
					populate: [{path: 'user', select: 'name picture_url'},
						{path: 'product'}]}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchPageReviewByTitle: (req, res) => Review.aggregate([
		// {

		// 	$match: {
		// 		$or: [{
		// 			$text: {
		// 				$search: req.body.key,
		// 				$caseSensitive: false
		// 			}
		// 		}, {
		// 			title: { $regex: new RegExp(req.body.key.toLowerCase(), 'i') }
		// 		}]
		// 	}
		// },
		{
			$project: {
				index: {
					$cond: [
						{
							$in: [req.body.key, '$tag']
						}, 1, {$indexOfCP: [
							{
								$toLower: '$title'
							},
							{
								$toLower: req.body.key
							}
						]}
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, review) => {
			if (err) res.send(err)
			Review.paginate(
				{
					_id: { $in: review }
				},
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, {path: 'product'}]
				}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchReviewByProduct: (req, res) => Product.aggregate([
		{
			$project: {
				index: {
					$cond: [
						{
							$gte: [ {$indexOfCP: [
								{
									$toLower: '$name'
								},
								{
									$toLower: req.body.key
								}
							]}, 0 ]
						}, {$indexOfCP: [
							{
								$toLower: '$name'
							},
							{
								$toLower: req.body.key
							}
						]}, {$cond: [
							{
								$gte: [ {$indexOfCP: [
									{
										$toLower: '$brand'
									},
									{
										$toLower: req.body.key
									}
								]}, 0 ]
							}, {$indexOfCP: [
								{
									$toLower: '$brand'
								},
								{
									$toLower: req.body.key
								}
							]}, -1
						]}
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, product) => {
			if (err) res.send(err)
			Review.find({ product: { $in: product } })
				.populate('user', 'name picture_url')
				.populate('product')
				.exec((err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchPageReviewByProduct: (req, res) => Product.aggregate([
		{
			$project: {
				index: {
					$cond: [
						{
							$gte: [ {$indexOfCP: [
								{
									$toLower: '$name'
								},
								{
									$toLower: req.body.key
								}
							]}, 0 ]
						}, {$indexOfCP: [
							{
								$toLower: '$name'
							},
							{
								$toLower: req.body.key
							}
						]}, {$cond: [
							{
								$gte: [ {$indexOfCP: [
									{
										$toLower: '$brand'
									},
									{
										$toLower: req.body.key
									}
								]}, 0 ]
							}, {$indexOfCP: [
								{
									$toLower: '$brand'
								},
								{
									$toLower: req.body.key
								}
							]}, -1
						]}
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, product) => {
			if (err) res.send(err)
			Review.paginate(
				{
					product: { $in: product }
				},
				{
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					populate: [{path: 'user', select: 'name picture_url'}, 'product']
				}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchProductName: (req, res) => Product.aggregate([
		{
			$project: {
				index: {
					$cond: [
						{
							$gte: [ {$indexOfCP: [
								{
									$toLower: '$name'
								},
								{
									$toLower: req.body.key
								}
							]}, 0 ]
						}, {$indexOfCP: [
							{
								$toLower: '$name'
							},
							{
								$toLower: req.body.key
							}
						]}, {$cond: [
							{
								$gte: [ {$indexOfCP: [
									{
										$toLower: '$brand'
									},
									{
										$toLower: req.body.key
									}
								]}, 0 ]
							}, {$indexOfCP: [
								{
									$toLower: '$brand'
								},
								{
									$toLower: req.body.key
								}
							]}, -1
						]}
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, product) => {
			if (err) res.send(err)
			Product.find({ _id: { $in: product } })
				.select('name brand')
				.exec((err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchPageProductName: (req, res) => Product.aggregate([
		{
			$project: {
				index: {
					$cond: [
						{
							$gte: [ {$indexOfCP: [
								{
									$toLower: '$name'
								},
								{
									$toLower: req.body.key
								}
							]}, 0 ]
						}, {$indexOfCP: [
							{
								$toLower: '$name'
							},
							{
								$toLower: req.body.key
							}
						]}, {$cond: [
							{
								$gte: [ {$indexOfCP: [
									{
										$toLower: '$brand'
									},
									{
										$toLower: req.body.key
									}
								]}, 0 ]
							}, {$indexOfCP: [
								{
									$toLower: '$brand'
								},
								{
									$toLower: req.body.key
								}
							]}, -1
						]}
					]
				}
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1
			}
		}
	])
		.exec((err, product) => {
			if (err) res.send(err)
			Product.paginate(
				{
					_id: { $in: product }
				}, {
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					select: 'name brand'
				}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		})

}
