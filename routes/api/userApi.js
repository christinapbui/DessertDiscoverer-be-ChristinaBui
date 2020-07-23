var express = require("express");
var router = express.Router();
const {
	createUser,
	getMyProfile,
	changeInfo,
	loginWithEmail,
	getSellerList,
	logout,
} = require("../../controllers/userController");
const { loginRequired } = require("../../middleware/auth");

router.route("/").get(getSellerList).post(createUser);

router.get("/logout", loginRequired, logout);

router.route("/login").post(loginWithEmail);

router
	.route("/me")
	.get(loginRequired, getMyProfile)
	.put(loginRequired, changeInfo);

module.exports = router;
