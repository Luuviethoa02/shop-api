const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    product_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
    ],
    discount_code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'discountCode',
      required: true,
    },
    status:{
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    }
  },
  { timestamps: true }
)

const ProductDiscount = mongoose.model('productDiscount', schema)

module.exports = ProductDiscount
