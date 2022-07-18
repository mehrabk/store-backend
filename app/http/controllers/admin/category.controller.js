const { CategoryModel } = require("../../../models/categories")
const Controller = require("../controller")
const createError = require("http-errors")
const { addCategorySchema } = require("../../validators/admin/category.schema")

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      await addCategorySchema.validateAsync(req.body)
      const { title, parent } = req.body
      const category = await CategoryModel.create({ title, parent })
      if (!category) throw createError.InternalServerError("internal Error")
      return res.status(200).json({
        statusCode: 200,
        message: "category added successfuly",
        categoryTitle: category.title
      })
    } catch (error) {
      next(error)
    }
  }
  removeCategory(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  editCategory(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  getAllCategory(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  getCategoryById(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
  getAllParents(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }

  getChildOfParents(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
}
module.exports = {
  CategoryController: new CategoryController()
}
