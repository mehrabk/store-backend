const { AdminRoutes } = require("./admin/admin.routes")
const { HomeRoute } = require("./api")
const { DeveloperRoutes } = require("./developer.routes")
const { AuthRoute } = require("./user/auth")

const router = require("express").Router()

router.use("/auth", AuthRoute)
router.use("/admin", AdminRoutes)
router.use("/", HomeRoute)
router.use("/dev", DeveloperRoutes)
module.exports = {
  allRoutes: router
}
