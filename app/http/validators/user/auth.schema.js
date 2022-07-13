const joi = require("joi")
const authSchema = joi.object({
  email: joi.string().lowercase().trim().email().required(),
  password: joi.string().min(6).max(16).trim().required()
})

module.exports = {
  authSchema
}
