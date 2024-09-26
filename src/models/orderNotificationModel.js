const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sellers',
      required: true,
    },
    orderDetailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oder_details',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const OrderNotification = mongoose.model('orderNotification', schema)

module.exports = OrderNotification
