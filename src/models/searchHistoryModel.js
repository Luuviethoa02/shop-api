const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    keyWords:{
        type: String,
        require: true,
    },
    count:{
        type: Number,
        require: true,
        default: 1,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  { timestamps: true }
)

const SearchHistory = mongoose.model('searchHistory', schema)

module.exports = SearchHistory
