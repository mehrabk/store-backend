const authController = require("../../http/controllers/user/auth/auth.controller")

const router = require("express").Router()

router.post("/get-otp", authController.getOtp)
router.post("/check-otp", authController.checkOtp)

module.exports = {
  AuthRoute: router
}
