const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true, 
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true, 
    },
    comment: {
      type: String,
      required: true, // Bắt buộc phải có nội dung bình luận
      unique : false
    },
    rating: {
      type: Number, // Thay đổi kiểu dữ liệu nếu cần
      required: true, // Bắt buộc phải có rating
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    notifications: [
      {
        notifiedUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        isRead: { 
          type: Boolean, 
          default: false 
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        },
      },
    ],
  });

const CommentsModel = mongoose.model('comments', schema)

module.exports = CommentsModel;