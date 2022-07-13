const authController = require("../../http/controllers/user/auth/auth.controller")

const router = require("express").Router()

router.post("/login", authController.login.bind(authController))

module.exports = {
  AuthRoute: router
}
