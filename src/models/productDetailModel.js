const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    imgs: [
      {
        type: String,
        require: true,
      },
    ]
    
  },
  { timestamps: true }
)
const ProductDetailModel = mongoose.model('products_detail', schema)

module.exports = ProductDetailModel
