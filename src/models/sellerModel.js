const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: '',
    },
    businessName: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    district: {
      type: String,
      require: true,
    },
    ward: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    addressDetail: {
      type: String,
      require: true,
    },
    img_cover: {
      type: String,
      default: '',
    },
    followers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        },
      },
    ],
    followings: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'sellers',
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        },
      },
    ],
    username: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['wait', 'finished', 'rejected'],
      default: 'wait',
    },
    express: {
      type: Boolean,
      default: true,
    },
    fast: {
      type: Boolean,
      default: true,
    },
    economical: {
      type: Boolean,
      default: true,
    },
    bulkyGoods: {
      type: Boolean,
      default: true,
    },
    businessType: {
      type: String,
      enum: ['personal', 'company', 'business'],
      default: 'personal',
    },
    slug: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

const SellerModel = mongoose.model('sellers', schema)

module.exports = SellerModel
