const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    oder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oders',
      required: true,
    },
    shipper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shippers',
      required: true,
    },
  },
  { timestamps: true }
)

const ShippingModel = mongoose.model('shipping', schema)

module.exports = ShippingModel
