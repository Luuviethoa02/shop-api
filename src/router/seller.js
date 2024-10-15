const express = require('express')
const SellController = require('../controller/sellerController')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const router = express.Router()

//add new sell

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
    tempFileDir: './users/', // Đường dẫn lưu file tạm thời
  })
)

const updateImageColor = async (req, res, next) => {
    try {
      const colorImg = req.files.logo || req.files.img_cover
      if(colorImg){
        const result = await cloudinary.uploader.upload(colorImg.tempFilePath, {
          folder: 'users',
        })
        if(req.files.logo){
            req.body.logo = result.secure_url
        }else{
            req.body.img_cover = result.secure_url
        }
        next()
      }else{
        console.error('ENot found image update')
       return res
          .status(500)
          .json({ message: 'Not found image update' })
      }
    } catch (error) {
      console.error('Error during image upload:', error)
      return res
        .status(500)
        .json({ message: 'Upload failed', error: error.message || error })
    }
  }
  
router.post('/add',SellController.addSeller)
router.get('/getAll',SellController.getAll)
router.get('/getInfo/:slug',SellController.getInfo)
router.get('/getAnalystics/:sellerId',SellController.getAnalystics)
router.get('/topshops',SellController.topShops)
router.patch('/update/:sellerId',SellController.updateStatus)
router.patch('/updateInfo/:sellerId',SellController.updateInfo)
router.patch('/follower',SellController.addFollower)
router.patch('/unfollower',SellController.unFollower)
router.patch('/updateLogo/:sellerId',updateImageColor,SellController.updateImage)




module.exports = router
