const joi = require("joi")
const getOtpSchema = joi.object({
  mobile: joi
    .string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("incorrect mobile number"))
})

const chechOtpSchema = joi.object({
  mobile: joi
    .string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("incorrect mobile number")),
  code: joi.string().min(4).max(6).error(new Error("code is not correct"))
})

module.exports = {
  getOtpSchema,
  chechOtpSchema
}
