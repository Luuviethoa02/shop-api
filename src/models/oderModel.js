const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    address_id: {
      name: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      district: {
        type: String,
        default: null,
      },
      ward: {
        type: String,
        default: null,
      },
      phone: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
    },
    type_pay: {
      type: String,
      enum: ['momo', 'cash'],
      default: 'cash',
    },
    status_pay: {
      status:{
        type: String,
        enum: ['wait', 'success', 'failure'],
        default: 'wait',
      },
      messages: {
        type: String,
        default: null,
      },
      payUrl: {
        type: String,
        default: null,
      },
      oderId:{
        type: String,
        default: null,
      }
    },
    totalPrice :{
      type: Number,
      require: true,
    }
  },
  { timestamps: true }
)

const OderModel = mongoose.model('oders', schema)

module.exports = OderModel
