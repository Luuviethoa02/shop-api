const express = require('express')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')

const AuthController = require('../controller/authController.js')
const Authorization = require('../middleware/auth.js')
const router = express.Router()

router.use(fileUpload({
    useTempFiles: true,  // Lưu file tạm thời trên server trước khi upload
    tempFileDir: '../users/', // Đường dẫn lưu file tạm thời
  }))

const uploadAvatar =async (req, res, next) =>{
    try {
        if (!req.files || !req.files.img) {
          return res.status(400).json({ message: 'No image uploaded.' })
        }
        const file = req.files.img
    
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'users',
        })
        req.body.img = result.secure_url
        next()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
}

//users-register
router.post('/register', AuthController.registerUser)
router.post('/login-google', AuthController.registerGoole)

//users-login
router.post('/login', AuthController.loginUser)
//users-check
router.get('/check', AuthController.checkUser)

//users-get
router.get('/me', Authorization, AuthController.getUser)

//users-get
router.patch('/avatar/:userId',uploadAvatar, AuthController.updateAvatar)
router.patch('/user/:userId', AuthController.updateUser)

router.get('/getAll', AuthController.getAllUsers)

//logout
router.post('/logout', AuthController.logoutUser)


//referesh token
router.post('/refresh-token', AuthController.refereshToken)

module.exports = router
