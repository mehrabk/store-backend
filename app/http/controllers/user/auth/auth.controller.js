const { getOtpSchema, chechOtpSchema } = require("../../../validators/user/auth.schema")
const Controller = require("../../controller")
const createError = require("http-errors")
const {
  generateRandom,
  SignAccessToken,
  VerifyRefreshToken,
  SignRefreshToken
} = require("../../../../utils/Utils")
const { UserModel } = require("../../../../models/users")

module.exports = new (class UserAuthController extends Controller {
  async getOtp(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body)

      const { mobile } = req.body
      const code = generateRandom()

      const result = await this.saveUser(mobile, code)

      if (!result) throw createError.Unauthorized("login failed")
      return res.status(200).send({
        data: { statusCode: 200, messsage: "otp code successfully sended", code, mobile }
      })
    } catch (error) {
      next(error)
    }
  }

  async checkOtp(req, res, next) {
    try {
      await chechOtpSchema.validateAsync(req.body)
      const { mobile, code } = req.body
      const user = await UserModel.findOne({ mobile })
      if (!user) throw createError.Unauthorized("user not found")
      if (user.otp.code != code) throw createError.Unauthorized("otp code incorrect")
      if (Number(user.otp.expiresIn) < Date.now()) throw createError.Unauthorized("expired code")
      const accessToken = await SignAccessToken(user._id)
      const refreshToken = await SignRefreshToken(user._id)

      return res.json({
        data: { accessToken, refreshToken }
      })
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      const userId = await VerifyRefreshToken(refreshToken)
      const accessToken = await SignAccessToken(userId)
      const newRefreshToken = await SignRefreshToken(userId)
      return res.json({
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async saveUser(mobile, code) {
    let otp = {
      code,
      expiresIn: new Date().getTime() + 120000
    }
    const isExistUser = await this.checkExistUser(mobile)
    if (isExistUser) {
      return await this.updateUser(mobile, otp)
    }
    return await UserModel.create({
      mobile,
      otp,
      Roles: ["USERS"]
    })
  }

  async checkExistUser(mobile) {
    const user = await UserModel.findOne({ mobile })
    return !!user
  }

  async updateUser(mobile, otp) {
    const incorrectArray = ["", " ", 0, null, undefined, "0", NaN]

    Object.entries(otp).forEach(([key, val]) => {
      if (incorrectArray.includes(val)) {
        delete otp[key]
      }
    })
    const updatedResult = await UserModel.updateOne({ mobile }, { otp })
    console.log(updatedResult)
    return !!updatedResult.modifiedCount
  }
})()
