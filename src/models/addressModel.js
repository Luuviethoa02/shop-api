const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    city:{
      type: String,
      require: true,
    },
    district:{
      type: String,
      require: true,
    },
    ward:{
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    default: {
      type: Boolean,
      require: true,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true }
)

const AddressModel = mongoose.model('address', schema)

module.exports = AddressModel
