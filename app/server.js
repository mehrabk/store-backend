const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const { allRoutes } = require("./router/router")
const morgan = require("morgan")
const createError = require("http-errors")

module.exports = class Application {
  #app = express()
  #DB_URI
  #PORT
  constructor(PORT, DB_URI) {
    this.#PORT = PORT
    this.#DB_URI = DB_URI

    this.configApplication()
    this.initRedis()
    this.connectToMongoDB()
    this.createServer()
    this.createRoutes()
    this.errorHandling()
  }

  configApplication() {
    this.#app.use(morgan("dev"))
    this.#app.use(express.json()) // for receive JSON data
    this.#app.use(express.urlencoded({ extended: true })) // for receive content-type : x-www-form-urlencode
    this.#app.use(express.static(path.join(__dirname, "..", "public")))
  }

  createServer() {
    const http = require("http")
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log("server is listening on port =", this.#PORT)
    })
  }

  connectToMongoDB() {
    mongoose.connect(this.#DB_URI, err => {
      if (!err) return console.log("connected to mongodb")
      console.log("failed to connect mongoDB!!!")
    })

    process.on("SIGINT", async () => {
      await mongoose.connection.close() // for close db connection ?!
      process.exit(0)
    })
  }

  initRedis() {
    require("./utils/init-redis")
  }

  createRoutes() {
    this.#app.use(allRoutes)
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("address not found"))
    })

    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError()
      const statusCode = error.status || serverError.status
      const message = error.message || serverError.message
      return res.status(statusCode).json({
        errors: {
          statusCode,
          message
        }
      })
    })
  }
}
