const express = require('express')
const BrandController = require('../controller/brandController.js')
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

//get all brand
router.get('/', BrandController.getAllBrand)
//add brand
router.get('/detail/:id', BrandController.getBrandById)
router.post(
  '/add',
  upload.single('img_cover'),
  BrandController.addBrand
)

module.exports = router
