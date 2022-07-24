const { VerifyAccessToken } = require("../../http/middlewares/verifyAccessToken")
const { AdminBlogRoutes } = require("./blog")
const { CategoryRoutes } = require("./category")

const router = require("express").Router()

router.use("/category", CategoryRoutes)
router.use("/blog", VerifyAccessToken, AdminBlogRoutes)

module.exports = {
  AdminRoutes: router
}
