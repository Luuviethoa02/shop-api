const OdersModel = require('../models/oderModel.js')
const OderController = {
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
  addOders: (req, res, next) => {
    try {
      const newOder = new OdersModel({
        user_id: req.body.user_id,
        address_id: req.body.address_id,
        type_pay: req.body.type_pay,
      })
      newOder.save()
      res.status(200).json(newOder._id)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getOdersbyId: async (req, res, next) => {
    try {
      const user_id = req.params.id
      const odersFind = await OdersModel.find({ user_id: user_id })
      if (odersFind) {
        return res.status(200).json(odersFind)
      } else {
        return res.status(200).json({ error: 'no oder' })
      }
    } catch (error) {
      console.log(error)
    }
  },
 
  getAllOders:async (req, res, next) => {
    try {
      const odersFind = await OdersModel.find()
      if (odersFind) {
        return res.status(200).json(odersFind)
      } else {
        return res.status(200).json({ error: 'no oder' })
      }
    } catch (error) {
      console.log(error)
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

module.exports = OderController
