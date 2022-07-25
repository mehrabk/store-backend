const { createBlogSchema } = require("../../validators/admin/blog.schema")
const Controller = require("../controller")
const path = require("path")
const { BlogModel } = require("../../../models/blogs")
const { deleteFileInPublic } = require("../../../utils/Utils")
const createHttpError = require("http-errors")

class BlogController extends Controller {
  async createBlog(req, res, next) {
    try {
      const blogDataBody = await createBlogSchema.validateAsync(req.body)
      req.body.image = path.join(blogDataBody.fileUploadPath, blogDataBody.filename)
      const { title, text, short_text, category, tags } = req.body
      console.log(req.user)
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
      const blog = await this.fingBlog(id)
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

  async fingBlog(id) {
    // const blog = await BlogModel.findById(id).populate([
    //   { path: "category", select: ["title"] },
    //   { path: "author", select: ["mobile", "first_name", "last_name", "username"] }
    // ])
    const blog = await BlogModel.findById(id)
    if (!blog) throw createHttpError.NotFound("blog not found")
    return blog
  }

  async getAll(req, res, next) {
    const blogs = await BlogModel.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "author",
          as: "author"
        }
      },
      {
        $unwind: "$author"
      },
      {
        $project: { "author.Roles": 0, "author.otp": 0 }
      },
      {
        $match: {}
      },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $project: { "category.__v": 0 }
      }
    ])
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
    } catch (error) {
      next(error)
    }
  }

  async updateBlogById(req, res, next) {
    try {
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  AdminBlogController: new BlogController()
}
