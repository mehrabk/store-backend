const joi = require("joi")
const { MongoIDPattern } = require("../../../utils/constans")
const addCategorySchema = joi.object({
  title: joi.string().min(3).max(30).error(new Error("title not correct")),
  parent: joi.string().allow("").pattern(MongoIDPattern).error(new Error("parent Id not valid"))
})
module.exports = {
  addCategorySchema
}
