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
const reviewRoutes = require("./reviewApi");

router.route("/").get(getAllReviews).post(loginRequired, createReview);

router
	.route("/:rid")
	.get(getSingleReview)
	.patch(loginRequired, updateReview)
	.delete(loginRequired, deleteReview);

module.exports = router;
