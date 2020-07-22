const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const round = 10; // complexity of algorithm/how secure you want the password to be
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema(
	{
		storeName: {
			type: String,
			required: [true, "Store name is required!"],
			trim: true,
		},
		pictureUrl: {
            type: String,
            trim: true,
        },
        streetAddress: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        phone: {
            type: Number, 
            trim: true,
		},
		services: {
			type: String,
			enum: ["delivery", "takeout", "dine in"],
			required: [true, "You must offer at least 1 service!"],
        },
        hours: { // need to edit this
            type: String,
        },
        description: {
            type: String,
        },
        desserts: {
            type: mongoose.Schema.ObjectId,
            ref: "Dessert"
        },
		tokens: [String],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

sellerSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	delete obj.tokens;
	return obj;
};

// generate token
sellerSchema.methods.generateToken = async function () {
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

sellerSchema.statics.loginWithEmail = async function (email, password) {
	const seller = await this.findOne({ email: email }); 
  
	if (!seller) return null;
  
	const match = await bcrypt.compare(password, user.password); 
  
	if (match) {
	  return seller; 
	}
	return null;
};

sellerSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
	  this.password = await bcrypt.hash(this.password, round); 
	}
	next();
});

sellerSchema.statics.findOneOrCreate = async function ({ email, name }) {
	let seller = await this.findOne({ email });
	if (!seller) {
	  seller = await this.create({
		email: email,
		displayName: name,
	  });
	}
	return seller;
};

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
