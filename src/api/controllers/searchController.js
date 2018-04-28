import Review from '../models/reviewModel'
import Product from '../models/productModel'
import User from '../models/userModel'

export default{

	searchUser: (req, res) => User.aggregate([
		{
			$project: {
				index: {
					$indexOfCP: [
						{
							$toLower: '$name'
						},
						req.body.key
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
		.exec((err, user) => {
			if (err) res.send(err)
			User.populate(user, {path: '_id', select: 'name picture_url'}, (err, popObject) => {
				if (err) res.send(err)
				res.send(user)
			})
		}),

	searchPageUser: (req, res) => User.aggregate([
		{
			$project: {
				index: {
					$indexOfCP: [
						{
							$toLower: '$name'
						},
						req.body.key
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
		.exec((err, user) => {
			if (err) res.send(err)
			User.paginate(
				{
					_id: { $in: user }
				}, {
					page: req.params.pid,
					limit: parseInt(req.params.psize, 10),
					select: 'name picture_url'
				}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchReviewByTag: (req, res) => Review.aggregate([
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
		{
			$project: {
				index: {
					$cond: [
						{
							$in: [{$toLower: req.body.key}, '$tag']
						}, 1, {$indexOfCP: [
							{
								$toLower: '$title'
							},
							{
								$toLower: req.body.key
							}
						]}
					]
				},
				timestamp: 1
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1,
				timestamp: -1
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

	searchPageReviewByTitle: (req, res) => {
		var aggreate = Review.aggregate([
			{
				$project: {
					index: {
						$cond: [
							{
								$in: [{$toLower: req.body.key}, '$tag']
							}, 1, {$indexOfCP: [
								{
									$toLower: '$title'
								},
								{
									$toLower: req.body.key
								}
							]}
						]
					},
					timestamp: 1
				}
			},
			{
				$match: {
					index: { $gte: 0 }
				}
			},
			{
				$sort: {
					index: 1,
					timestamp: -1
				}
			}
		])
		Review.aggregatePaginate(
			aggreate,
			{
				page: req.params.pid,
				limit: parseInt(req.params.psize, 10)
			}, (err, results, pageCount, count) => {
				if (err) res.send(err)
				Review.populate(results,
					{path: '_id',
						populate: [{path: 'user', select: 'name picture_url'},
							{path: 'product'}]}, (err, popObject) => {
						if (err) res.send(err)
						var docInfo = {
							docs: popObject,
							total: count,
							limit: req.params.psize,
							page: req.params.pid,
							pages: pageCount
						}
						res.send(docInfo)
					})
			})
	},

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
				.sort({timestamp: -1})
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
				},
				timestamp: 1
			}
		},
		{
			$match: {
				index: { $gte: 0 }
			}
		},
		{
			$sort: {
				index: 1,
				timestamp: -1
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
					populate: [{path: 'user', select: 'name picture_url'}, 'product'],
					sort: {timestamp: -1}
				}, (err, popObject) => {
					if (err) res.send(err)
					res.send(popObject)
				})
		}),

	searchProductName: (req, res) => Product.aggregate([
		{
			$project: {
				index: {$indexOfCP: [
					{
						$toLower: '$name'
					},
					{
						$toLower: req.body.key
					}
				]}
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
		},
		{
			$limit: 5
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
		})
}
