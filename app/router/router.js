const { VerifyAccessToken } = require("../http/middlewares/verifyAccessToken")
const { HomeRoute } = require("./api")
const { AuthRoute } = require("./user/auth")

const router = require("express").Router()

router.use("/auth", AuthRoute)
router.use("/", VerifyAccessToken, HomeRoute)

module.exports = {
  allRoutes: router
}
