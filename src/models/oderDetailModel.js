const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    oder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oders',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity: {
      type: Number,
      default: '',
    },
    size_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sizes',
        required: true,
      },
    
    color_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'colors',
        required: true,
      },
    
    type_tranfer: {
      type: Boolean,
    },
    status: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

const OderDetailModel = mongoose.model('oder_detail', schema)

module.exports = OderDetailModel
