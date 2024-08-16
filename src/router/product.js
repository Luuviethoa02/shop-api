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
    console.log(req.body);
    const colors = req.body.colors;
    if (!colors || colors.length === 0) {
      return res.status(400).json({ message: "No colors were provided." });
    }

    const uploadPromises = colors.map(async (color) => {
      const file = color.image[0]; 
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'products',
      });
      return {
        name: color.name, 
        image: result.secure_url, 
      };
    });

    const uploadedColors = await Promise.all(uploadPromises);
    req.body.colors = uploadedColors; 

    next();
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
