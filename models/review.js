const mongoose = require("mongoose")

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