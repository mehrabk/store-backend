const { HomeRoute } = require("./api")
const { AuthRoute } = require("./user/auth")

const router = require("express").Router()
 
router.use("/user", AuthRoute)
router.use("/", HomeRoute)

module.exports = {
  allRoutes: router
}
