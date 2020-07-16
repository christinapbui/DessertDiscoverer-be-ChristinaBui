const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const round = 10; // complexity of algorithm/how secure you want the password to be
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "Email is required!"],
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		displayName: {
			type: String,
			required: [true, "Display name is required!"],
			trim: true,
		},
		password: {
			type: String,
		},
		userRole: {
			type: String,
			enum: ["normal", "seller"],
			required: [true, "User role is required!"],
			default: "normal",
		},
		tokens: [String],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	delete obj.tokens;
	return obj;
};

// generate token
userSchema.methods.generateToken = async function () {
	// cannot use arrow function; this will become undefined if use arrow function
	// this will refer to the instance of User
	// { _id: X, name: "khoa", email: "@gmail.com"}
	const token = jwt.sign(
		{
			_id: this._id, // "this" refers to the instance
		},
		process.env.SECRET_KEY,
		{ expiresIn: "7d" }
	);
	this.tokens.push(token); // refers to & pushes "tokens" array above in the schema
	await this.save();
	return token; // return this to attach it the response in authController
};

const User = mongoose.model("User", userSchema);

module.exports = User;
