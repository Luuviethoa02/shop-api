const CommentsModel = require("../models/commentModel")

const CommentsController = {
  addComments: async (req, res) => {
    try {
      const { userId, productId, commentText, rating } = req.body
      const io = req.io

      // Tạo và lưu bình luận mới
      const newComment = new CommentsModel({
        userId,
        productId,
        comment: commentText,
        rating,
        notifications: [],
      })

      await newComment.save()

      // Tìm tất cả các bình luận liên quan đến sản phẩm
      const existingComments = await CommentsModel.find({ productId })

      // Hàm xử lý thông báo và gửi socket
      const handleNotifications = async () => {
        const notificationPromises = existingComments.map(async (comment) => {          
          if (comment.userId.toString() != userId) {
            comment.notifications.push({
              notifiedUserId: userId,
              isRead: false,
            })
            await comment.save()

            // Gửi thông báo qua socket
            try {
              // Kiểm tra xem socket có được kết nối không
      
              if (io.sockets.sockets.has(comment.userId.toString())) {
                io.to(comment.userId.toString()).emit('newNotification', {
                  productId,
                  commentText,
                  rating,
                  fromUserId: userId,
                })
              } else {
                console.warn(`Socket not connected for user ${comment.userId}`)
              }
            } catch (socketError) {
              console.error(
                `Socket error for user ${comment.userId}:`,
                socketError
              )
            }
          }
        })

        await Promise.all(notificationPromises)
      }

      // Gọi hàm xử lý thông báo sau khi lưu bình luận thành công
      handleNotifications().catch((err) => {
        console.error('Error handling notifications:', err)
      })

      return res
        .status(200)
        .json({ message: 'Bình luận đã được đăng và thông báo đã được gửi' })
    } catch (err) {
      console.error('Error while adding comment:', err)
      return res.status(500).json({
        message: 'Có lỗi xảy ra trong quá trình xử lý',
        error: err.message,
      })
    }
  },
}

module.exports = CommentsController
