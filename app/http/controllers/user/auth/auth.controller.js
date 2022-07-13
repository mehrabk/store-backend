const { authSchema } = require("../../../validators/user/auth.schema")
const Controller = require("../../controller")
const createError = require("http-errors")

module.exports = new (class UserAuthController extends Controller {
  async login(req, res, next) {
    try {
      await authSchema.validateAsync(req.body)
      return res.status(200).send("successfull")
    } catch (error) {
      next(createError.BadRequest(error.message))
    }
  }
})()
