const mongoose = require("mongoose")
const Dessert = require("./dessert")

const reviewSchema = new mongoose.Schema({
    reviewofDessert: {
        type: mongoose.Schema.ObjectId,
        ref: "Dessert",
        required: [true, "Please select a dessert to review"]
    },
    title: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 100,
        required: [true, "Review must have a title!"]
    },
    body: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 1000,
        required: [true, "Review must have body text!"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review needs a rating!"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must have a user!"]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//calculate average & number of ratings
reviewSchema.statics.calculateAverage = async function(did){
    const stats = await this.aggregate([
        {
            $match: { dessert: did }
        },
        {
            $group: {
                _id: "$dessert",
                // number of ratings & average ratings
                numRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ])
    await Dessert.findByIdAndUpdate(did, {
        numRating: stats.length > 0 ? stats[0].numRating: 0,
        avgRating: stats.length > 0 ? stats[0].avgRating: 0
    })
    console.log(stats)
}

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review;