const { VerifyAccessToken, checkRole } = require("../../http/middlewares/verifyAccessToken")
const { AdminBlogRoutes } = require("./blog")
const { CategoryRoutes } = require("./category")

const router = require("express").Router()

router.use("/category", CategoryRoutes)
router.use("/blog", VerifyAccessToken, checkRole("ADMIN"), AdminBlogRoutes)

module.exports = {
  AdminRoutes: router
}
