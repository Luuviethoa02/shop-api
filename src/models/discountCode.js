const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    discount_code: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      default: null,
    },
    discount_percentage: {
      type: Number,
      require: true,
    },
    start_date: {
      type: String,
      require: true,
    },
    end_date: {
      type: String,
      require: true,
    },
    is_active: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sellers',
      required: true,
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        default: [],
      },
    ],
  },
  { timestamps: true }
)

const DiscountCode = mongoose.model('discountCode', schema)

module.exports = DiscountCode
