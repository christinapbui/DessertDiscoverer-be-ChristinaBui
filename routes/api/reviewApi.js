var express = require("express");
var router = express.Router({ mergeParams: true });
var {
	getAllReviews,
	createReview,
	getSingleReview,
	updateReview,
	deleteReview,
} = require("../../controllers/reviewController");
var { loginRequired } = require("../../middleware/auth");

router.route("/").get(getAllReviews);

router
	.route("/add")
	// .post(loginRequired, createDessert);
	.post(loginRequired, createReview);

router
	.route("/:id")
	.get(getSingleReview)
	.patch(loginRequired, updateReview)
	.delete(loginRequired, deleteReview);

module.exports = router;
