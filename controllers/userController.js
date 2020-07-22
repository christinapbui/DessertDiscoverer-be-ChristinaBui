const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const configMsg = require("../models/user/userValidationConfig");
const httpStatus = require("http-status");
const utilHelper = require("../helpers/util.helper");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

exports.getMyProfile = async (req, res, next) => {
	res.json({
		status: "ok",
		data: req.user,
	});
};

exports.loginWithEmail = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			status: "fail",
			error: "Email and password are required",
		});
	}
	const user = await User.loginWithEmail(email, password);
	// const user = await User.findOne({ email, password });
	console.log("user info", user);
	if (!user) {
		return res.status(401).json({
			status: "fail",
			error: "Wrong email or password",
		});
		// } else {
		// 	const isMatch = await bcrypt.compare(password, user.password);
		// 	if (isMatch) {
		// 	  const { token, payload } = await userController.validLoginResponse(
		// 		req,
		// 		user,
		// 		next
		// 	  );
		// 	  return res.status(200).json({
		// 		  status: "ok",
		// 		  data: token, payload // FINISH/DOUBLE CHECK
		// 	  })
		// } else {
		// 	errors.password // FINISH
	}

	const token = await user.generateToken(); // if calling through instance, don't need to pass argument

	res.json({
		status: "ok",
		data: { user: user, token: token },
	});
	// next have to compare hashed password with raw password in DB
});

// NEED TO FIX to ONLY get list of sellers!
exports.getSellerList = async (req, res, next) => {
	try {
		const sellerList = await User.find({
			userRole: "seller",
		}); // need to add "seller" to object to only return sellers (probably)

		res.status(200).json({
			sellerList,
		});
	} catch (err) {
		res.status(400).json({
			status: "Failed to get list of sellers",
			error: err.message,
		});
	}
};

exports.createUser = async (req, res, next) => {
	try {
		const { email, displayName, password, userRole } = req.body;
		if (!email || !displayName || !password) {
			return res.status(400).json({
				status: "failed",
				error: "Email, display name, and password are required!",
			});
		}
		const user = await User.findOne({ email: email });
		if (user) {
			const errors = { email: "Email already exists" };
			return res.status(httpStatus.CONFLICT).json({
				status: "Fail",
				data: errors,
			});
		}

		let newUser = await User({
			email,
			displayName,
			password,
			userRole: userRole || "normal",
		});

		newUser = await newUser.save();

		const token = await newUser.generateToken();
		res.status(201).json({
			status: "ok",
			data: newUser,
			token: token,
		});
	} catch (err) {
		res.status(500).json({
			status: "error",
			error: err.message,
		});
	}
};

exports.changeInfo = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		const fields = Object.keys(req.body);
		fields.map((field) => (user[field] = req.body[field]));
		await user.save();
		res.status(200).json({
			status: "successfully changed info",
			data: user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "error",
			error: err.message,
		});
	}
};

exports.logout = async function (req, res) {
	try {
		const token = req.headers.authorization.replace("Bearer ", "");
		req.user.tokens = req.user.tokens.filter((el) => el !== token);
		await req.user.save();
		res.status(204).json({
			status: "successfully logged out",
			data: null,
		});
	} catch (err) {
		res.status(401).json({
			status: "failed to logout",
			message: err.message,
		});
	}
};
