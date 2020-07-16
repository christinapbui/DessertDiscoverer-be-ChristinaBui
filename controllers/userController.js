const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const configMsg = require("../models/user/userValidationConfig");
const httpStatus = require("http-status");
const utilHelper = require("../helpers/util.helper");
const axios = require("axios");

exports.loginFacebook = async (req, res) => {
	const fbToken = req.query.fbToken;
	if (!fbToken) {
		return res.status(401).json({
			status: "Failed",
			error: "Need FB token",
		});
	}
	const data = await axios.get(
		`https://graph.facebook.com/me?fields=id,name,email&access_token=${fbToken}`
	); // have to call this API to get data
	console.log(data);

	const user = await User.findOneOrCreate({
		name: data.data.name,
		email: data.data.email,
	});
	const token = await user.generateToken();
	return utilHelper.sendResponse(
		res,
		httpStatus.OK,
		false,
		user,
		errors,
		errors.email,
		token
	);
};

exports.loginGoogle = async (req, res, next) => {
	const ggToken = req.query.token;
	if (!ggToken) {
		return res.status(401).json({
			status: "fail",
			error: "need token",
		});
	}
	const data = await axios.get(
		`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${ggToken}`
	); // have to call this API to get data
	console.log(data);

	const user = await User.findOneOrCreate({
		name: data.data.name,
		email: data.data.email,
	});
	const token = await user.generateToken();
	res.json({
		status: "ok",
		data: user,
		token: token,
	});
};

// NEED TO FIX to ONLY get list of sellers!
exports.getSellerList = async (req, res, next) => {
	try {
		const sellerList = await User.find({}); // need to add "seller" to object to only return sellers (probably)

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
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newUser.password, salt);
		newUser.password = hash;
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
