const User = require("../models/user");
const Dessert = require("../models/dessert");
const Review = require("../models/review");
const { deleteOne } = require("./handlerFactory");

// get list of reviews
// exports.getAllReviews = async (req, res, next) => {
//     try {
//         const reviewList = await Experience.find({}) // use this to query and get list of exp and return it // empty object unless you want to execute a certain condition

//         res.status(200).json({ // 200 is successful code
//             reviewList
//         })

//     }catch(err) {
//         res.status(400).json({
//             status: "failed to get list",
//             error: err.message
//         })
//     }
// }

exports.getAllReviews = async (req, res) => {
	const page = parseInt(req.query.page) || 1; // .page is the param
	const PAGE_SIZE = 20;
	const minPrice = parseInt(req.query.minPrice) || 0;
	const maxPrice = parseInt(req.query.maxPrice) || 1000000;
	const skip = (page - 1) * PAGE_SIZE;

	const allReviews = await Review.find({})
		.populate("tags")
		.populate("seller", "-email")
		.populate("user")
		.skip(skip)
		.limit(PAGE_SIZE)
		.sort({ price: 1 });

	const numDocuments = await Review.countDocuments({
		price: { $gte: minPrice, $lte: maxPrice },
	});

	res.send({
		data: allReviews,
		maxPageNum: Math.ceil(numDocuments / PAGE_SIZE),
	});
};

// exports.createReview = async (req, res, next) => {
//     try{
//         const {reviewOfDessert, title, description, rating} = req.body;
//         if(!reviewOfDessert || !title || !description || !rating){
//             return res.status(400).json({  // 400 is bad request (wrong format, not enough required arguments)
//                 status: "fail",
//                 error: "Dessert, title, description, and rating are required"
//             })
//         }
//         const review = await Review.create({
//             reviewofExp: reviewOfExp,
//             title: title,
//             description: description,
//             rating: rating,
//             // user: req.user._id
//         })
//         res.status(201).json({ // 201 means new thing created
//             status: "ok",
//             data: review
//         })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             status: "error",
//             error: err.message
//         })
//     }

// }

exports.createReview = async (req, res) => {
	const reviewOfDessert = await Dessert.exists({ _id: req.params.id });
	if (!reviewOfDessert) {
		return res.status(404).json({
			message: "dessert not found",
		});
	}
	const title = req.body.title;
	const rating = req.body.rating;
	const body = req.body.body;
	const user = req.user._id;

	const newReview = await Review.create({
		reviewOfDessert: req.params.id,
		title,
		rating,
		body,
		// tags,
		user,
	});
	console.log(newReview);
	res.send(newReview);
};

exports.updateReview = async (req, res, next) => {
	try {
		const review = await Review.findOne({
			_id: req.params.rid,
			user: req.user._id,
		});
		if (!review)
			return res
				.status(404)
				.json({ status: "fail", message: "No document found" });

		const fields = Object.keys(req.body);
		fields.map((field) => (review[field] = req.body[field]));
		await review.save();
		res.status(200).json({
			status: "successfully changed info",
			data: review,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "error",
			error: err.message,
		});
	}
};

exports.getSingleReview = async (req, res) => {
	const singleReview = await Review.findById(req.params.id);
	res.send(singleReview);
};

exports.deleteReview = deleteOne(Review);
