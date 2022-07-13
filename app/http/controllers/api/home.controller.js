const Controller = require("../controller")

module.exports = new (class HomeController extends Controller {
  constructor() {
    super()
  }
  indexPage(req, res, next) {
    return res.status(200).send("store index page " + this.test())
  }
})()
