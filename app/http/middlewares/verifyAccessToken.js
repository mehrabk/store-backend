const createHttpError = require("http-errors")
const JWT = require("jsonwebtoken")
const { UserModel } = require("../../models/users")

function getToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || []
  if (token && ["Bearer", "bearer"].includes(bearer)) return token
  throw createHttpError.Unauthorized("حساب کاربری شناسایی نشد وارد حساب کاربری خود شوید")
}

function VerifyAccessToken(req, res, next) {
  try {
    const token = getToken(req.headers)
    JWT.verify(token, "mehrab", async (err, payload) => {
      if (err) throw createHttpError.Unauthorized("token incorrect or expires")
      const { mobile } = payload || {}
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
      if (!user) throw createHttpError.Unauthorized("user not found")
      req.user = user
      next()
    })
  } catch (error) {
    next(error)
  }
}

function checkRole(role) {
  return function (req, res, next) {
    try {
      const user = req.user
      console.log(user)
      if (user?.Roles.includes(role)) return next()
      throw createHttpError.Forbidden("you not have permission to access this section")
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  VerifyAccessToken,
  checkRole
}
