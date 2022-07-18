const { CategoryController } = require("../../http/controllers/admin/category.controller")

const router = require("express").Router()

router.post("/add", CategoryController.addCategory)

module.exports = {
  CategoryRoutes: router
}
