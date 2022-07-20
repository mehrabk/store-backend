const { CategoryController } = require("../../http/controllers/admin/category.controller")

const router = require("express").Router()

router.post("/add", CategoryController.addCategory)
router.get("/parents", CategoryController.getAllParents)
router.get("/children/:parent", CategoryController.getChildOfParents)
router.get("/all", CategoryController.getAllCategory)
router.delete("/remove/:id", CategoryController.removeCategory)
router.get("/get-all-list", CategoryController.getAllCategoryWithoutPopulate)
router.get("/:id", CategoryController.getCategoryById)
router.patch("/:id", CategoryController.editCategoryTitle)

module.exports = {
  CategoryRoutes: router
}
