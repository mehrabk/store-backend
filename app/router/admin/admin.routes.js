const { CategoryRoutes } = require("./category")

const router = require("express").Router()

router.use("/category", CategoryRoutes)

module.exports = {
  AdminRoutes: router
}
