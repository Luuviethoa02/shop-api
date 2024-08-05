const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    oder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oders',
      required: true,
    },
    reason_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reason',
      required: true,
    },
  },
  { timestamps: true }
)

const CancelModel = mongoose.model('cancel', schema)

module.exports = CancelModel
