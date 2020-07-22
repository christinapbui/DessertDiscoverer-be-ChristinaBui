const mongoose = require("mongoose");

const dessertSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			minLength: 3,
			maxLength: 100,
			required: [true, "Dessert must have a name!"],
		},
		pictureUrl: {
			type: String,
			trim: true,
		},
		price: {
			type: Number,
			trim: true,
			required: [true, "Dessert must have a price!"],
		},
		rating: {
			// FINISH
			type: Number,
		},
		description: {
			type: String,
		},
		tags: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Tag",
				required: [true, "Dessert must have at least one tag!"],
			},
		],
		seller: {
			// this should link to individual seller page
			type: mongoose.Schema.ObjectId,
			ref: "User", //
			required: [true, "Dessert must have a seller!"],
		},
		// "services" should be listed under seller page
		// services: { // similar to tag, either delivery, takeout or dine-in
		//     type: mongoose.Schema.ObjectId,
		//     ref: "Services",
		//     required: [true, "Dessert must have a service listed!"]
		// }
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

dessertSchema.virtual("reviews", {
	ref: "Review",
	localField: "_id",
	foreignField: "reviewOfDessert",
});

const Dessert = mongoose.model("Dessert", dessertSchema);

module.exports = Dessert;
