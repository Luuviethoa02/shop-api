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
      default: '',
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
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
)

const DiscountCode = mongoose.model('discountCode', schema)

module.exports = DiscountCode
