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
      mobile: user.mobile
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

function SignRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId)
    console.log(user)
    const payload = {
      mobile: user.mobile
    }

    const options = {
      expiresIn: "1y"
    }
    JWT.sign(payload, "mehrab-refresh", options, (err, token) => {
      if (err) return reject(createError.Unauthorized("refreshtoken error"))
      console.log(token)
      return resolve(token)
    })
  })
}

function VerifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, "mehrab-refresh", async (err, payload) => {
      if (err) return reject(createError.Unauthorized("refresh token verify error"))
      const { mobile } = payload || {}
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
      if (!user) return reject(createError.Unauthorized("user not found"))
      resolve(user._id)
    })
  })
}

module.exports = {
  generateRandom,
  SignAccessToken,
  SignRefreshToken,
  VerifyRefreshToken
}
