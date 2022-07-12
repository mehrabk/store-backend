const path = require("path")
const express = require("express")
const mongoose = require("mongoose")

module.exports = class Application {
  #app = express()
  #DB_URI
  #PORT
  constructor(PORT, DB_URI) {
    this.#PORT = PORT
    this.#DB_URI = DB_URI

    this.configApplication()
    this.connectToMongoDB()
    this.createServer()
    this.createRoutes()
    this.errorHandling()
  }

  configApplication() {
    this.#app.use(express.json()) // for recive JSON data
    this.#app.use(express.urlencoded({ extended: true })) // for recive content-type : x-www-form-urlencode
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
  }

  createRoutes() {}

  errorHandling() {
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        statusCode: 404,
        message: "address not found"
      })
    })

    this.#app.use((error, req, res, next) => {
      const statusCode = error.status || 500
      const message = error.message || internalServerError
      return res.status(statusCode).json({
        statusCode,
        message
      })
    })
  }
}
