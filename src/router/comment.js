const express = require('express')
const CommentsController = require('../controller/commentController')

const router = express.Router()

router.post('/add', CommentsController.addComments)
router.delete('/:commentId', CommentsController.deleteComments)
router.get('/product/:productId', CommentsController.getCommentsByIdProduct)
router.get('/notifications/:userId', CommentsController.getNotificationsByIdUser)

module.exports = router
