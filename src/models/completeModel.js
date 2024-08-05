const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    oder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'oders',
      required: true,
    },
  },
  { timestamps: true }
)

const CompleteModel = mongoose.model('complete', schema)

module.exports = CompleteModel
