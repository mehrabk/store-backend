const createError = require("http-errors")
const JWT = require("jsonwebtoken")
const { UserModel } = require("../../models/users")
function VerifyAccessToken(req, res, next) {
  const headers = req.headers
  const [bearer, token] = headers?.authorization?.split(" ") || []
  console.log(bearer, token)
  if (token && bearer?.toLowerCase() === "bearer") {
    JWT.verify(token, "mehrab", async (err, payload) => {
      if (err) return createError.Unauthorized("sign to your account")
      const { mobile } = payload || {}
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
      console.log(user)
      if (!user) return createError.Unauthorized("user not found")
      req.user = user
      next()
    })
  } else next(createError.Unauthorized("sign to your account"))
}

module.exports = {
  VerifyAccessToken
}
