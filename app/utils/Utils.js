const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const { UserModel } = require("../models/users")
const redisClient = require("./init-redis")
const fs = require("fs")
const path = require("path")

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

async function generateRedisData() {
  const redisData = await redisClient.keys("*")
  const result = await Promise.all(redisData.map(key => redisClient.get(key)))
  const data = redisData.map((item, index) => ({
    [item]: result[index]
  }))
  console.log(__dirname)
  fs.writeFileSync(path.join(__dirname, "..", "..", "redisData.txt"), JSON.stringify(data, null, 2), "utf-8")
}

function SignRefreshToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userId)
    const payload = {
      mobile: user.mobile
    }

    const options = {
      expiresIn: "1y"
    }
    JWT.sign(payload, "mehrab-refresh", options, async (err, token) => {
      try {
        if (err) {
          return reject(createError.Unauthorized("refreshtoken error"))
        } else {
          await redisClient.set(userId.toString(), token, { EX: 360 * 24 * 60 * 60 }, err => console.log(err))
          await generateRedisData()
          resolve(token)
        }
      } catch (err) {
        console.log(err)
      }
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
      const refreshToken = await redisClient.get(user._id.toString())
      console.log(token, refreshToken)
      if (token === refreshToken) {
        console.log(mobile)
        resolve(user._id)
      }
      reject(createError.Unauthorized("refresh token not valid"))
    })
  })
}

module.exports = {
  generateRandom,
  SignAccessToken,
  SignRefreshToken,
  VerifyRefreshToken
}
