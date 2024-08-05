const express = require('express')
const UserController = require('../controller/userController.js')
const MiddlewareController = require('../controller/middlewareController.js');

const router = express.Router()

//refresh tokens
router.get('/refresh-token',MiddlewareController.refreshToken)

//delete users
router.delete('/:id', UserController.deleteUser)

//get users-all

router.get('/',MiddlewareController.verifyToken, UserController.getAllUsers)


module.exports = router
