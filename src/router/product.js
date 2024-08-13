const express = require('express')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const ProductController = require('../controller/productController.js')
const router = express.Router()

router.use(fileUpload({
  useTempFiles: true,  // Lưu file tạm thời trên server trước khi upload
  tempFileDir: '../products/', // Đường dẫn lưu file tạm thời
}))

// Middleware xử lý upload nhiều ảnh
const uploadMultipleImages = async (req, res, next) => {
  try {
    const files = req.files.images 
    if (!files) {
      return res.status(400).json({ message: "No files were uploaded." })
    }
    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'products',
      })
    )
    const results = await Promise.all(uploadPromises)
    console.log(results);
    req.body.images = results.map(result => result.secure_url)
    next()
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error })
  }
}

//get all product
router.get('/', ProductController.getAllProducts)
router.get('/detail/:id', ProductController.getProudctDetailById)
//add product
router.post(
  '/add',
  uploadMultipleImages,
  ProductController.addProduct
)



router.put(
  '/edit/:id',
  ProductController.editProduct
)

router.delete('/delete/:id', ProductController.deleteProduct)

module.exports = router
