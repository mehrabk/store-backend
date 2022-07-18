const homeController = require("../../http/controllers/api/home.controller")
const { VerifyAccessToken } = require("../../http/middlewares/verifyAccessToken")

const router = require("express").Router()

router.get("/", VerifyAccessToken, homeController.indexPage)

module.exports = {
  HomeRoute: router
}
