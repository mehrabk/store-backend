const { CategoryController } = require("../../http/controllers/admin/category.controller")

const router = require("express").Router()

router.post("/add", CategoryController.addCategory)
router.get("/parents", CategoryController.getAllParents)
router.get("/children/:parent", CategoryController.getChildOfParents)
router.get("/all", CategoryController.getAllCategory)
router.delete("/remove/:id", CategoryController.removeCategory)
router.get("/:id", CategoryController.getCategoryById)

module.exports = {
  CategoryRoutes: router
}
