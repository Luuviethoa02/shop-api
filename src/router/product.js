const express = require('express')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const ProductController = require('../controller/productController.js')
const router = express.Router()

// Load environment variables
require('dotenv').config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

router.use(
  fileUpload({
    useTempFiles: true, // Lưu file tạm thời trên server trước khi upload
    tempFileDir: './products/', // Đường dẫn lưu file tạm thời
  })
)

const uploadMultipleImages = async (req, res, next) => {
  try {
    const uploadedColors = []

    // Phân tích sizes và colors từ req.body
    const sizes = []
    const colors = []

    for (const key in req.body) {
      if (key.startsWith('sizes[') && key.endsWith('].name')) {
        const index = key.match(/sizes\[(\d+)\]\.name/)[1]
        sizes[index] = sizes[index] || {}
        sizes[index].name = req.body[`sizes[${index}].name`]
        sizes[index].weight = req.body[`sizes[${index}].weight`]
      }

      if (key.startsWith('colors[') && key.endsWith('].name')) {
        const index = key.match(/colors\[(\d+)\]\.name/)[1]
        colors[index] = colors[index] || {}
        colors[index].name = req.body[`colors[${index}].name`]
      }
    }

    // Xử lý các tệp ảnh
    for (const key in req.files) {
      if (key.startsWith('colors[') && key.endsWith('].image')) {
        const colorIndex = key.match(/colors\[(\d+)\]\.image/)[1]
        const file = req.files[key]

        if (!colors[colorIndex] || !colors[colorIndex].name) {
          return res
            .status(400)
            .json({ message: `Color data is missing for index ${colorIndex}.` })
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'products',
        })

        uploadedColors.push({
          name: colors[colorIndex].name,
          image: result.secure_url,
        })
      }
    }

    if (uploadedColors.length > 0) {
      req.body.colors = uploadedColors
    }

    req.body.sizes = sizes // Gán lại sizes đã phân tích
    next()
  } catch (error) {
    console.error('Error during image upload:', error)
    res
      .status(500)
      .json({ message: 'Upload failed', error: error.message || error })
  }
}

const updateImageColor = async (req, res, next) => {
  try {
    const colorImg = req.files.img
    if(colorImg){
      const result = await cloudinary.uploader.upload(colorImg.tempFilePath, {
        folder: 'products',
      })
      req.body.image = result.secure_url
      next()
    }else{
      console.error('ENot found image update')
      res
        .status(500)
        .json({ message: 'Not found image update' })
    }
  } catch (error) {
    console.error('Error during image upload:', error)
    res
      .status(500)
      .json({ message: 'Upload failed', error: error.message || error })
  }
}

//get all product
router.get('/', ProductController.getAllProducts)
router.get('/detail/:slug', ProductController.getProudctDetailById)
router.get('/seller/:sellerId', ProductController.getProudctDetailByIdSeller)
//add product
router.post('/add', uploadMultipleImages, ProductController.addProduct)

router.put('/edit/:id', ProductController.editProduct)
router.put('/color/:id', ProductController.editColorProduct)
router.put(
  '/color/img/:id',
  updateImageColor,
  ProductController.updateImageColorProduct
)

router.delete('/delete/:id', ProductController.deleteProduct)

module.exports = router
