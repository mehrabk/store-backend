const createError = require("http-errors")
const JWT = require("jsonwebtoken")
const { UserModel } = require("../../models/users")
function VerifyAccessToken(req, res, next) {
  const headers = req.headers
  const [bearer, token] = headers?.authorization?.split(" ") || []
  if (token && bearer?.toLowerCase() === "bearer") {
    JWT.verify(token, "mehrab", async (err, payload) => {
      if (err) return next(createError.Unauthorized("token incorrect or expires"))
      const { mobile } = payload || {}
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
      if (!user) return next(createError.Unauthorized("user not found"))
      req.user = user
      next()
    })
  } else next(createError.Unauthorized("sign to your account"))
}

module.exports = {
  VerifyAccessToken
}
