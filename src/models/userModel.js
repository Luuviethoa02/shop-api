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
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      default: '',
    },
    admin: {
      type: Boolean,
      default: false,
    },
    //createdAt , updatedAt
  },
  { timestamps: true }
)

const UserModel = mongoose.model('users', schema)

module.exports = UserModel
