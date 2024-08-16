const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brands',
      required: true,
    },
    sizes: [
      {
        name:{
          type:String,
          require
        },
        weight:{
          type:String,
          require
        }
      },
    ],
    colors: [
      {
        name:{
          type:String,
          require
        },
        image:{
          type:String,
          require
        },
      },
    ],
    des: {
      type: String,
      default: '',
    },
    publish: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

const ProductdModel = mongoose.model('products', schema)

module.exports = ProductdModel
