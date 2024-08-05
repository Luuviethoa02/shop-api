const UserModel = require('../models/userModel.js')
const bcrypt = require('bcrypt')

const UserController = {


  getUsersById: async (req, res) => {
    try {
      const user_id = req.params.id
      const userFinds = await UserModel.findById(user_id)
      if (userFinds) {
        return res.status(200).json(userFinds)
      } else {
        return res.status(200).json({ error: 'no address' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  //delete users by id
  deleteUser: async (req, res) => {
    try {
      const users = await UserModel.findById(req.params.id)
      res.status(200).json("delete successfully")
    } catch (err) {
      res.status(500).json(err)
    }
  },
}

module.exports = UserController;
