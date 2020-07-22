var express = require('express');
var router = express.Router();

const userRoutes = require("./api/userApi")
const dessertRoutes = require("./api/dessertApi")
const reviewRoutes = require("./api/reviewApi")
const sellerRoutes = require("./api/sellerApi")
router.use("/user", userRoutes)
router.use("/desserts", dessertRoutes)
router.use("/reviews", reviewRoutes)
router.use("/sellers", sellerRoutes)

module.exports = router;
