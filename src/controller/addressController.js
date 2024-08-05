const AddressModel = require('../models/addressModel.js')
const AddressController = {
  getAddressBy: async (req, res, next) => {
    try {
      const user_id = req.params.id
      const addressFinds = await AddressModel.find({ user_id: user_id })
      if (addressFinds.length > 0) {
        return res.status(200).json(addressFinds)
      } else {
        return res.status(200).json({ error: 'no address' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  getAllAddress: async (req, res, next) => {
    try {
      const addressFinds = await AddressModel.find()
      if (addressFinds) {
        return res.status(200).json(addressFinds)
      } else {
        return res.status(200).json({ error: 'no address' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  addAddress: (req, res, next) => {
    console.log(req.body)
    try {
      const newAddress = new AddressModel({
        username: req.body.username,
        phone: req.body.phone,
        detail: req.body.detail,
        user_id: req.body.user_id,
      })
      newAddress.save()
      res.status(200).json(newAddress)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  updateAddress: async (req, res) => {
    try {
      const id = req.params.id
      await AddressModel.updateOne(
        { _id: id },
        {
          $set: { default: true },
        }
      )
      await AddressModel.updateMany(
        { _id: { $ne: id } },
        {
          $set: { default: false },
        }
      )

      return res.status(200).json({ message: 'update address successfully' })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
}

module.exports = AddressController
