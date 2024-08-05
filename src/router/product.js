const express = require('express')
const ProductController = require('../controller/productController.js')
const multer = require('multer')
const Authorization = require('../middleware/auth.js')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads')
  },
  filename: function (req, file, cb) {
    if (file.originalname) {
      cb(null, file.originalname)
    }
  },
})

const upload = multer({ storage: storage })
const router = express.Router()

//get all product
router.get('/', ProductController.getAllProducts)
router.get('/detail/:id', ProductController.getProudctDetailById)
//add product
router.post(
  '/add',
  upload.single('avt'),
  ProductController.addProduct
)

const checkUploadCondition = (req, res, next) => {
  if (req.file) {
    req.body.avt = req.file.originalname
  }
  next()
}

router.put(
  '/edit/:id',
  upload.single('avt'),
  checkUploadCondition,
  ProductController.editProduct
)

router.delete('/delete/:id', ProductController.deleteProduct)

module.exports = router
