var express = require("express");
var router = express.Router();
const { createUser } = require("../../controllers/userController.js");

router.route("/register").post(createUser);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
