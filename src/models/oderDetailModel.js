const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    oder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oders',
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sellers',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    voucher: [
      {
        discount_code: {
          type: String,
          default: null,
        },
        discount_percentage: {
          type: Number,
          default: null,
        },
        discount_amount: {
          type: Number,
          default: null,
        },
        description: {
          type: String,
          default: null,
        },
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
    color: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'colors',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    size: {
      name: {
        type: String,
        default: null,
      },
      weight: {
        type: String,
        default: null,
      },
    },
    type_tranfer: {
      name: {
        type: String,
        enum: ['fast', 'save'],
        default: 'fast',
      },
      fee: {
        type: Number,
        default: 0,
      },
    },
    status_oder: {
      pending: {
        status: {
          type: Boolean,
          default: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
      shipping: {
        status: {
          type: Boolean,
          default: false,
        },
        created_at: {
          type: Date,
          default: null,
        },
      },
      success: {
        status: {
          type: Boolean,
          default: false,
        },
        created_at: {
          type: Date,
          default: null,
        },
      },
      canceled: {
        status: {
          type: Boolean,
          default: false,
        },
        message: {
          type: String,
          default: null,
        },
        created_at: {
          type: Date,
          default: null,
        },
        created_by: {
          infoId: {
            type: String,
            default: null,
          },
          shopper: {
            type: String,
            default: null,
          },
        },
      },
    },
  },
  { timestamps: true }
)

const OderDetailModel = mongoose.model('oder_details', schema)

module.exports = OderDetailModel
