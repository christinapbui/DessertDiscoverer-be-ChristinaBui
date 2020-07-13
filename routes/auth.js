const { loginWithEmail, loginFacebook, loginGoogle } = require("../controllers/authController")

router.route("/login")
.post(loginWithEmail)

router.route("/login/facebook")
.get(loginFacebook)

router.route("/login/google")
.get(loginGoogle)
