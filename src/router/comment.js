const express = require('express')
const CommentsController = require('../controller/commentController.js')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')

const router = express.Router()

require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

router.use(
  fileUpload({
    useTempFiles: true, // Lưu file tạm thời trên server trước khi upload
    tempFileDir: './comments/', // Đường dẫn lưu file tạm thời
  })
)

const updateImage = (req, res, next) => {
  const imgs = req?.files?.imgs || undefined
  if (imgs && imgs.length > 0) {
    const result = imgs.map(async (img) => {
      return await cloudinary.uploader.upload(img.tempFilePath, {
        folder: 'comments',
      })
    })
    Promise.all(result)
      .then((result) => {
        req.body.imgs = result.map((item) => item.secure_url)
        next()
      })
      .catch((error) => {
        console.error('Error during image upload:', error)
        return res
          .status(500)
          .json({ message: 'Upload failed', error: error.message || error })
      })
  } else {
    next()
  }
}

router.post('/add', updateImage, CommentsController.addComments)
router.delete('/:commentId', CommentsController.deleteComments)
router.get('/product/:productId', CommentsController.getCommentsByIdProduct)
router.get(
  '/notifications/:userId',
  CommentsController.getNotificationsByIdUser
)

module.exports = router
