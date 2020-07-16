var express = require("express")
var router = express.Router()
const { loginWithEmail, loginFacebook, loginGoogle } = require("../../controllers/authController")


router.route("/login")
.post(loginWithEmail)

router.route("/login/facebook")
.get(loginFacebook)

router.route("/login/google")
.get(loginGoogle)

module.exports = router;