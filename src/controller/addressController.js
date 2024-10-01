const { StatusCodes } = require('http-status-codes')
const AddressModel = require('../models/addressModel.js')
const AddressController = {
  getAddressBy: async (req, res, next) => {
    try {
      const user_id = req.params.id
      const addressFinds = await AddressModel.find({ userId: user_id })
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'lấy địa chỉ thành công',
        data: addressFinds,
      })
     
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      const addressId = req.params.addressId
      const result = await AddressModel.findByIdAndDelete(addressId)
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Xóa địa chỉ thành công',
        data: result,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
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
    try {
      if(!req.body){
        return res.status(400).json({
          code: 400,
          message: 'add address failed',
          data: null,
        })
      }
      const newAddress = new AddressModel(req.body)
      newAddress.save()
      res.status(200).json({
        code: 200,
        message: 'add address successfully',
        data: newAddress,
      })
    } catch (err) {
      res.status(500).json(err)
    }
  },

  setAddressDefault: async (req, res, next) => {
    try {
      const id = req.body.addressId
      const result = await AddressModel.updateOne(
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
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật địa chỉ thành công',
        data:result
       })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  updateAddress: async (req, res) => {
    try {
      const addressId = req.params.addressId
      const address = req.body
      const result = await AddressModel.findByIdAndUpdate(addressId, address,{
        new: true
      })
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật địa chỉ thành công',
        data: result,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
}

module.exports = AddressController
