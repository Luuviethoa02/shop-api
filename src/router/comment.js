const express = require('express')
const CommentController = require('../controller/commentController.js')

const router = express.Router()

router.post('/add',CommentController.addComments)

module.exports = router
