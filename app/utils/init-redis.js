const redisDB = require("redis")
const redisClient = redisDB.createClient()
const { exec } = require("child_process")

exec("redis-server") // run redis server on Port: 6379
redisClient.connect()
redisClient.on("connect", () => console.log("redis connected"))
redisClient.on("error", () => console.log("error occured while redis connected"))
redisClient.on("end", () => console.log("redis disconnected"))
redisClient.on("ready", () => console.log("redis is ready"))

module.exports = redisClient
