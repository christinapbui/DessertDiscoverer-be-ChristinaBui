var express = require("express")
var router = express.Router()
const { loginWithEmail, loginFacebook, loginGoogle } = require("../../controllers/userController")
var { loginRequired } = require("../../middleware/auth");


router.route("/login/facebook")
.get(loginFacebook)

router.route("/login/google")
.get(loginGoogle)

module.exports = router;