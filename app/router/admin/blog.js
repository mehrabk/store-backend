const { AdminBlogController } = require("../../http/controllers/admin/blog.controller")
const { stringToArray } = require("../../http/middlewares/stringToArray")
const { uploadFile } = require("../../utils/multer")

const router = require("express").Router()

router.get("/getAll", AdminBlogController.getAll)
router.post("/add", uploadFile.single("image"), stringToArray("tags"), AdminBlogController.createBlog)
router.get("/:id", AdminBlogController.getOneBlogById)
router.delete("/:id", AdminBlogController.deleteBlogById)
router.patch("/:id", AdminBlogController.updateBlogById)

module.exports = {
  AdminBlogRoutes: router
}
