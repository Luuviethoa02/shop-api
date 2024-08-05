const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    img_cover: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
      unique: true,
    },
    slug:{
        type: String,
        require: true,
        unique: true,
    }
  },
  { timestamps: true }
)

const BrandModel = mongoose.model('brands', schema)

module.exports = BrandModel
