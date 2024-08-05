const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    detail: {
      type: String,
      require: true,
    },
    default: {
      type: Boolean,
      require: true,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true }
)

const AddressModel = mongoose.model('address', schema)

module.exports = AddressModel
