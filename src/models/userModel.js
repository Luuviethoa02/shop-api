const mongoose = require('mongoose')

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      require: false,
    },
    img: {
      type: String,
      default: '',
    },
    admin: {
      type: Boolean,
      default: false,
    },
    loginGoogle:{
      type: Boolean,
      default: false,
    },
    sellerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sellers',
      default: null,
    },
    status: {
      type: String,
      enum: ['valid', 'invalid'],
      default: 'valid'
    },
    
  },
  { timestamps: true }
)

const UserModel = mongoose.model('users', schema)

module.exports = UserModel
