const multer = require("multer")
const path = require("path")
const fs = require("fs")
const createHttpError = require("http-errors")

function createRoute(req) {
  const date = new Date()
  const year = date.getFullYear().toString()
  const month = date.getMonth().toString()
  const day = date.getDate().toString()
  const dirPath = path.join(__dirname, "..", "..", "public", "uploads", "blogs", year, month, day)
  req.body.fileUploadPath = path.join("uploads", "blogs", year, month, day)
  fs.mkdirSync(dirPath, { recursive: true })
  return dirPath
}
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const filePath = createRoute(req)
    callback(null, filePath)
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname)
    const fileName = String(new Date().getTime() + ext)
    req.body.filename = fileName
    callback(null, fileName)
  }
})

function fileFilter(req, file, callback) { 
  const mimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp "]
  if (mimeTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(createHttpError.BadRequest("the image format is not valid"))
  }
}

const uploadFile = multer({
  storage,
  fileFilter,
  limits: {fileSize: 1000000}
})

module.exports = {
  uploadFile
}
