const joi = require("joi")
const { MongoIDPattern } = require("../../../utils/constans")
const createError = require("http-errors")

const createBlogSchema = joi.object({
  title: joi.string().min(3).max(30).error(createError.BadRequest("title of blog not correct")),
  text: joi.string().error(createError.BadRequest("text of blog not correct")),
  short_text: joi.string().error(createError.BadRequest("short text not valid")),
  filename: joi
    .string()
    .pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/)
    .error(createError.BadRequest("image not valid")),
  tags: joi.array().min(0).max(20).error(createError.BadRequest("tags not valid length")),
  category: joi.string().pattern(MongoIDPattern).error(createError.BadRequest("category not found")),
  fileUploadPath: joi.allow()
})

const updateCategorySchema = joi.object({
  titile: joi.string().min(3).max(30).error(createError.BadRequest("category titile not valid"))
})

module.exports = {
  createBlogSchema,
  updateCategorySchema
}
