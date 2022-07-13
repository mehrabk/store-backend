const autoBind = require("auto-bind")

module.exports = class Controller {
  constructor() {
    autoBind(this)
    this.test = this.test.bind(this)
  }

  test() {
    return "hello"
  }
}
