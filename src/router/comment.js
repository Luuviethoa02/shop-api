const express = require('express')
const CommentsController = require('../controller/commentController')

const router = express.Router()

router.post('/add',CommentsController.addComments)

module.exports = router
