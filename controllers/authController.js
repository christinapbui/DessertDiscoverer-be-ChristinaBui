// const axios = require("axios")

// exports.loginFacebook = async (req, res) => {
//     const fbToken = req.query.fbToken
//     if(!fbToken){
//         return res.status(401).json({
//             status: "Failed",
//             error: "Need FB token"
//         })
//     }
//     const data = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${fbToken}`) // have to call this API to get data
//     console.log(data)

//     const user = await User.findOneOrCreate({
//         name: data.data.name,
//         email: data.data.email
//     })
//     const token = await user.generateToken()
//     res.json({
//         status: "ok",
//         data: user, token
//     })

// }


// exports.loginGoogle = async (req, res, next) => {
//     const ggToken = req.query.token
//     if(!ggToken){
//         return res.status(401).json({
//             status: "fail",
//             error: "need token"
//         })
//     }
//     const data = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${ggToken}`) // have to call this API to get data
//     console.log(data)

//     const user = await User.findOneOrCreate({
//         name: data.data.name,
//         email: data.data.email
//     })
//     const token = await user.generateToken()
//     res.json({
//         status: "ok",
//         data: user, token
//     })
// }