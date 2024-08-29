const express = require('express')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const Authorization = require('../middleware/auth.js')
const BrandController = require('../controller/brandController.js')

const router = express.Router()

router.use(fileUpload({
  useTempFiles: true,  // Lưu file tạm thời trên server trước khi upload
  tempFileDir: './brands/', // Đường dẫn lưu file tạm thời
}))


const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.img_cover) {
      return res.status(400).json({ message: 'No image uploaded.' })
    }
    const file = req.files.img_cover

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'brands',
    })
    req.body.img_cover = result.secure_url
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


//get all brand
router.get('/', BrandController.getAllBrand)
//add brand
router.get('/detail/:slug', BrandController.getBrandById)
router.post(
  '/add',
  uploadImage,
  BrandController.addBrand
)

module.exports = router
