const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const { UserModel } = require("../models/users")

function generateRandom() {
  return Math.floor(Math.random() * 900000) + 100000
}

function SignAccessToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId)

    const payload = {
      mobile: user.mobile,
      userId: user._id
    }
    const optioins = {
      expiresIn: "1h"
    }

    JWT.sign(payload, "mehrab", optioins, (err, token) => {
      if (err) {
        reject(createError.InternalServerError("token error"))
      }
      resolve(token)
    })
  })
}

module.exports = {
  generateRandom,
  SignAccessToken
}
