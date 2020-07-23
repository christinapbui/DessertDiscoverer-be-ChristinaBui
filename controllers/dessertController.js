const Dessert = require("../models/dessert");
const Tag = require("../models/tag");
const Review = require("../models/review");

const getAllDesserts = async (req, res) => {
	const page = parseInt(req.query.page) || 1; // .page is the param
	const PAGE_SIZE = 20;
	const minPrice = parseInt(req.query.minPrice) || 0;
	const maxPrice = parseInt(req.query.maxPrice) || 1000000;
	const skip = (page - 1) * PAGE_SIZE;

	const allDesserts = await Dessert.find({
		price: { $gte: minPrice, $lte: maxPrice },
	})
		.populate("tags")
		.populate("seller", "-email")
		.skip(skip)
		.limit(PAGE_SIZE)
		.sort({ price: 1 });

	const numDocuments = await Dessert.countDocuments({
		price: { $gte: minPrice, $lte: maxPrice },
	});

	res.send({
		data: allDesserts,
		maxPageNum: Math.ceil(numDocuments / PAGE_SIZE),
	});
};

const createDessert = async (req, res) => {
	const name = req.body.name;
	const pictureUrl = req.body.pictureUrl;
	const price = req.body.price;
	// const rating = req.body.rating;
	const description = req.body.description;
	const tags = await Tag.convertToObject(req.body.tags);
	const seller = req.user._id;

	console.log(req.body);

	const newDessert = await Dessert.create({
		name,
		pictureUrl,
		price,
		// rating,
		description,
		tags,
		seller,
	});
	console.log(newDessert);
	res.send(newDessert);
};

const updateDessert = async (req, res) => {
	try {
		const singleDessert = await Dessert.findOne({
			_id: req.params.id,
		});
		delete req.body.seller;

		if (!singleDessert)
			return res.status(404).json({
				status: "Fail",
				message: "No dessert found",
			});

		const fields = Object.keys(req.body);
		fields.map((field) => (singleDessert[field] = req.body[field]));
		singleDessert.tags = await Tag.convertToObject(req.body.tags);
		console.log(singleDessert);
		await singleDessert.save();
		res.status(200).json({
			status: "Successfully updated your dessert",
			data: singleDessert,
		});
	} catch (err) {
		res.status(500).json({
			status: "Error updating dessert",
			error: err.message,
		});
	}
};

const getSingleDessert = async (req, res) => {
	const singleDessert = await Dessert.findById(req.params.id)
		.populate("tags")
		.populate("seller", "-email");
	// .populate("reviews")
	const reviews = await Review.find({ reviewOfDessert: req.params.id })
		.populate("user")
		.limit(5)
		.sort("-rating");
	res.send({ singleDessert: singleDessert, reviews: reviews });
};

const deleteDessert = async (req, res) => {
	const singleDessert = await Dessert.findByIdAndDelete(req.params.id);
};

module.exports = {
	getAllDesserts,
	createDessert,
	updateDessert,
	getSingleDessert,
	deleteDessert,
};
