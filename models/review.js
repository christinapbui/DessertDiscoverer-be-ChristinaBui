const mongoose = require("mongoose");
const Dessert = require("./dessert");

const reviewSchema = new mongoose.Schema(
	{
		reviewOfDessert: {
			// this will contain dessert _id
			type: mongoose.Schema.ObjectId,
			ref: "Dessert",
			// required: [true, "Please select a dessert to review"]
		},
		title: {
			type: String,
			trim: true,
			minLength: 5,
			maxLength: 100,
			required: [true, "Review must have a title!"],
		},
		body: {
			type: String,
			trim: true,
			minLength: 5,
			maxLength: 1000,
			required: [true, "Review must have body text!"],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, "Review needs a rating!"],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			// required: [true, "Review must have a user!"]
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//calculate average & number of ratings
reviewSchema.statics.calculateAverage = async function (did) {
	const stats = await this.aggregate([
		{
			$match: { dessert: did },
		},
		{
			$group: {
				_id: "$dessert",
				// number of ratings & average ratings
				numRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	await Dessert.findByIdAndUpdate(did, {
		numRating: stats.length > 0 ? stats[0].numRating : 0,
		avgRating: stats.length > 0 ? stats[0].avgRating : 0,
	});
	console.log(stats);
};

// middleware for post(save)
reviewSchema.post("save", async function () {
	// will review the document
	await this.constructor.calculateAverage(this.dessert); // this.dessert will catch the "eid" from the calculateAverage function
});

//query middleware to trigger findOneAnd... (pre)
reviewSchema.pre(/^findOneAnd/, async function () {
	// "this" ==== Review.query
	this.doc = await this.findOne();
	if (!this.doc) {
		next(new AppError(404, "Doc not found"));
	}
	return next();
});

//query middleware to trigger findOneAnd... (post)
reviewSchema.post(/^findOneAnd/, async function () {
	// findOneAnd does not work for delete
	// "this" ==== Review.query

	// this.constructor ==== Review model
	await this.doc.constructor.calculateAverage(this.doc.dessert);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
