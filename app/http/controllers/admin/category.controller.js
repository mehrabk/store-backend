const { CategoryModel } = require("../../../models/categories")
const Controller = require("../controller")
const createError = require("http-errors")
const { addCategorySchema, updateCategorySchema } = require("../../validators/admin/category.schema")
const mongoose = require("mongoose")

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
  async removeCategory(req, res, next) {
    try {
      const { id } = req.params
      const category = await this.checkExistCategory(id)
      // delete category and cildrens
      const deleteCategory = await CategoryModel.deleteMany({
        $or: [{ _id: category._id }, { parent: category._id }]
      })
      if (deleteCategory.deletedCount == 0) throw createError.InternalServerError("delete category error")
      return res.status(200).json({
        data: {
          statusCode: 200,
          message: "deleted category successfully"
        }
      })
    } catch (error) {
      next(error)
    }
  }
  async checkExistCategory(id) {
    if (!mongoose.isValidObjectId(id)) throw createError.NotFound("id is not valid")
    const category = await CategoryModel.findById(id)
    if (!category) throw createError.NotFound("category not found")
    return category
  }
  async editCategoryTitle(req, res, next) {
    try {
      const { id } = req.params
      const { title } = req.body
      await updateCategorySchema.validateAsync(req.body)
      const category = await this.checkExistCategory(id)
      const resultOfUpdate = await CategoryModel.updateOne({ _id: id }, { $set: { title } })
      if (resultOfUpdate.modifiedCount === 0) throw createError.InternalServerError("category update error")
      return res.status(200).json({
        statusCode: 200,
        message: "category updated successfully"
      })
    } catch (error) {
      next(error)
    }
  }
  async getAllCategory(req, res, next) {
    try {
      // const categories = await CategoryModel.aggregate([
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "_id",
      //       foreignField: "parent",
      //       as: "children"
      //     }
      //   },

      //   {
      //     $match: {
      //       parent: undefined
      //     }
      //   },
      //   {
      //     $project: {
      //       __v: 0,
      //       parent: 0,
      //       "children.__v": 0,
      //       "children.parent": 0
      //     }
      //   }
      // ])
      const categories = await CategoryModel.find({ parent: undefined }, { __v: 0 })
      res.status(200).json({
        statusCode: 200,
        data: categories
      })
    } catch (error) {
      next(error)
    }
  }
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params
      const categories = await CategoryModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children"
          }
        },
        {
          $project: {
            __v: 0,
            parent: 0,
            "children.__v": 0,
            "children.parent": 0
          }
        }
      ])
      return res.status(200).json({
        statusCode: 200,
        data: categories
      })
    } catch (error) {
      next(error)
    }
  }
  async getAllParents(req, res, next) {
    try {
      const parents = await CategoryModel.find({ parent: undefined }, { _id: 0, __v: 0 })
      return res.status(200).json({
        statusCode: 200,
        data: { parents }
      })
    } catch (error) {
      next(error)
    }
  }
  async getAllCategoryWithoutPopulate(req, res, next) {
    try {
      const categories = await CategoryModel.aggregate([
        {
          $match: {}
        },
        {
          $project: {
            parent: 0
          }
        }
      ])

      res.status(200).json({
        statusCode: 200,
        data: categories
      })
    } catch (error) {
      next(error)
    }
  }
  async getChildOfParents(req, res, next) {
    try {
      const { parent } = req.params
      const children = await CategoryModel.find({ parent }, { parent: 0, __v: 0 })
      return res.status(200).json({
        data: {
          statusCode: 200,
          parent: children
        }
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = {
  CategoryController: new CategoryController()
}
