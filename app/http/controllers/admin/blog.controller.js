const { createBlogSchema } = require("../../validators/admin/blog.schema")
const Controller = require("../controller")
const path = require("path")
const { BlogModel } = require("../../../models/blogs")
const { deleteFileInPublic } = require("../../../utils/Utils")
const createHttpError = require("http-errors")
const { default: mongoose } = require("mongoose")
const { StatusCodes: HttpStatus } = require("http-status-codes")

class BlogController extends Controller {
  async createBlog(req, res, next) {
    try {
      const blogDataBody = await createBlogSchema.validateAsync(req.body)

      req.body.image = path.join(blogDataBody.fileUploadPath, blogDataBody.filename)
      const { title, text, short_text, category, tags } = req.body
      await BlogModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        image: req.body.image,
        author: req.user._id
      })
      return res.status(201).json({
        data: {
          statusCode: 201,
          message: "blog created successfully"
        }
      })
    } catch (error) {
      deleteFileInPublic(req.body.image)
      next(error)
    }
  }

  async getOneBlogById(req, res, next) {
    try {
      const { id } = req.params
      console.log(id)
      const blog = await this.findBlog(id)
      return res.status(200).json({
        data: {
          statusCode: 200,
          blog
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async findBlog(id) {
    const blog = await BlogModel.findOne({ _id: id }).populate([
      { path: "category" },
      { path: "author", select: "mobile" }
    ])
    if (!blog) throw createHttpError.NotFound("blog not found")
    return blog
  }

  async getAll(req, res, next) {
    const blogs = await BlogModel.find({})

    // ===> Aggregate
    // .aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       foreignField: "_id",
    //       localField: "author",
    //       as: "author"
    //     }
    //   },
    //   {
    //     $unwind: "$author"
    //   },
    //   {
    //     $project: { "author.Roles": 0, "author.otp": 0 }
    //   },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "category",
    //       foreignField: "_id",
    //       as: "category"
    //     }
    //   },
    //   {
    //     $unwind: "$category"
    //   },
    //   {
    //     $project: { "category.__v": 0 }
    //   }
    // ])

    // ===> Populate
    // const blogs = await BlogModel.find({}).populate([
    //   { path: "author", select: "mobile otp.expiresIn" },
    //   { path: "category" }
    // ])
    try {
      res.status(200).json({
        data: {
          blogs,
          statusCode: 200
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async getCommentsOfBlog(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }

  async deleteBlogById(req, res, next) {
    try {
      const { id } = req.params
      if (!mongoose.isValidObjectId(id)) throw createHttpError.NotFound("id not correct")
      const removeResult = await BlogModel.deleteOne({ _id: id })
      if (removeResult.removeResult == 0) throw createHttpError.InternalServerError("delete failed")
      return res.status(200).json({
        data: {
          statusCode: 200,
          message: "blog deleted successfully"
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async updateBlogById(req, res, next) {
    try {
      const { id } = req.params

      await this.findBlog(id)
      if (req?.body?.fileUploadPath && req?.body?.filename) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.filename)
        // req.body.image = req.body.image.replace(/\\/g, "/")
      }
      const data = req.body
      let nullishData = ["", " ", "0", 0, null, undefined]
      let blackListFields = ["bookmarks", "deslikes", "comments", "likes", "author"]
      Object.keys(data).forEach(key => {
        if (blackListFields.includes(key)) delete data[key]
        if (typeof data[key] == "string") data[key] = data[key].trim()
        if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
        if (nullishData.includes(data[key])) delete data[key]
      })

      console.log(data)
      const updateResult = await BlogModel.updateOne({ _id: id }, { $set: data })

      if (updateResult.modifiedCount == 0) throw createHttpError.InternalServerError("به روز رسانی انجام نشد")

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "به روز رسانی بلاگ با موفقیت انجام شد"
        }
      })
    } catch (error) {
      deleteFileInPublic(req?.body?.image)
      next(error)
    }
  }
}

module.exports = {
  AdminBlogController: new BlogController()
}
