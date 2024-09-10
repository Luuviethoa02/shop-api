const { StatusCodes } = require('http-status-codes')
const CommentsModel = require('../models/commentsModel.js')
const { formatDistanceToNow } = require('date-fns')
const { vi } = require('date-fns/locale')
const UserModel = require('../models/userModel.js')

const CommentsController = {
  addComments: async (req, res) => {
    try {
      const { userId, productId, commentText, rating } = req.body
      const io = req.io // Lấy io từ req

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
        .populate('productId', {
          _id: 1,
          name: 1,
          colors: 1,
        })
        .exec()

      const userIdAdd = await UserModel.findById(userId)

      // Hàm xử lý thông báo và gửi socket
      const handleNotifications = async () => {
        const notificationPromises = existingComments.map(async (comment) => {
          if (
            comment.userId.toString() != userId &&
            comment.notifications.find(
              (n) => n.notifiedUserId.toString() === userId
            ) === undefined
          ) {
            comment.notifications.push({
              notifiedUserId: userId,
              isRead: false,
            })

            await comment.save()

            try {
              io.to(comment.userId.toString()).emit('newNotification', {
                productId: comment.productId,
                comment: commentText,
                rating,
                userId: userIdAdd,
              })
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
  deleteComments: async (req, res) => {
    try {
      const { commentId } = req.params
      const comment = await CommentsModel.findByIdAndDelete(commentId).exec()
      return res.status(StatusCodes.OK).json({
        message: 'Bình luận đã được xóa thành công',
        data: comment,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra trong quá trình xử lý',
        error: err.message,
      })
    }
  },
  getCommentsByIdProduct: async (req, res) => {
    try {
      const productId = req.params.productId
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 2
      const skip = (page - 1) * limit
      const total = await CommentsModel.countDocuments().exec()

      const comments = await CommentsModel.find({ productId })
        .sort({
          createdAt: -1,
        })
        .populate('userId', {
          _id: 1,
          username: 1,
          img: 1,
        })
        .select('-notifications -productId') // Loại bỏ trường 'notification' và 'productId
        .skip(skip)
        .limit(total)
        .exec()

      const commentsWithRelativeTime = comments.map((comment) => ({
        ...comment.toObject(),
        relativeTime: formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
          locale: vi,
        }),
      }))

      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: commentsWithRelativeTime,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra trong quá trình xử lý',
        error: err.message,
      })
    }
  },
  getNotificationsByIdUser: async (req, res) => {
    try {
      const userId = req.params.userId
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 2
      const skip = (page - 1) * limit
      const total = await CommentsModel.countDocuments().exec()

      const notifications = await CommentsModel.find({
        userId,
        $expr: { $gt: [{ $size: '$notifications' }, 0] },
      })
        .select('comment rating createdAt productId notifications')
        .populate({
          path: 'productId', // Nếu bạn cũng muốn populate thông tin sản phẩm
          select: '_id name slug', // Chỉ chọn các trường cần thiết từ product
        })
        .populate({
          path: 'notifications.notifiedUserId', // Đường dẫn tới notifiedUserId bên trong mảng notifications
          select: '_id username img', // Chỉ chọn các trường cần thiết từ User
        })
        .skip(skip)
        .limit(total)
        .exec()

      return res.status(StatusCodes.OK).json({
        total,
        page,
        limit,
        data: notifications,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Có lỗi xảy ra trong quá trình xử lý',
        error: err.message,
      })
    }
  },
}

module.exports = CommentsController
