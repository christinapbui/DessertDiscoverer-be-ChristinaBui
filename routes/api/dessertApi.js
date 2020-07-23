var express = require("express");
var router = express.Router({ mergeParams: true });
const reviewRoutes = require("./reviewApi");

var {
	getAllDesserts,
	createDessert,
	getSingleDessert,
	updateDessert,
	deleteDessert,
} = require("../../controllers/dessertController");

var { loginRequired } = require("../../middleware/auth");

router.route("/").get(getAllDesserts);

router.route("/add").post(loginRequired, createDessert);
// .post(createDessert)

router.use("/:id/reviews", reviewRoutes);
router
	.route("/:id")
	.get(getSingleDessert)
	.patch(loginRequired, updateDessert)
	.delete(loginRequired, deleteDessert);

module.exports = router;
