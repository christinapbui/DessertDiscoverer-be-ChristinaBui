var express = require('express');
var router = express.Router();

const userRoutes = require("./api/userApi")
router.use("/user", userRoutes)

module.exports = router;
