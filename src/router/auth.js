const express = require('express')
const AuthController = require('../controller/authController.js')
const authorization = require('../middleware/auth.js')
const Authorization = require('../middleware/auth.js')
const router = express.Router()

//users-register
router.post('/register', AuthController.registerUser)

//users-login
router.post('/login', AuthController.loginUser)
//users-check
router.get('/check', AuthController.checkUser)

//users-get
router.get('/me', Authorization, AuthController.getUser)

router.get('/getAll', AuthController.getAllUsers)

//logout
router.post('/logout', AuthController.logoutUser)

//logout
router.put('/update', AuthController.updateUser)

//referesh token
router.post('/refresh-token', AuthController.refereshToken)

module.exports = router
