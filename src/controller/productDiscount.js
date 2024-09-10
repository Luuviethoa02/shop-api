const { StatusCodes } = require('http-status-codes')
const ProductDiscountModel = require('../models/productDiscount.js')
const { formatResponse } = require('../helpers')
const ProductDiscountController = {
  getAddressBy: async (req, res, next) => {
    try {
      const user_id = req.params.id
      const addressFinds = await ProductDiscountModel.find({ user_id: user_id })
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
      const addressFinds = await ProductDiscountModel.find()
      if (addressFinds) {
        return res.status(200).json(addressFinds)
      } else {
        return res.status(200).json({ error: 'no address' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  addproductDiscount:async (req, res) => {
    try {
      const newProductDiscount = new ProductDiscountModel({
        product_id: req.body.product_id,
        discount_code: req.body.discount_code,
      })
      const result = await newProductDiscount.save()
      res.status(StatusCodes.OK).json(formatResponse({
        code: StatusCodes.OK,
        message: 'Thêm giảm giá sản phẩm thành công',
        data: result,
      }))
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  updateAddress: async (req, res) => {
    try {
      const id = req.params.id
      await ProductDiscountModel.updateOne(
        { _id: id },
        {
          $set: { default: true },
        }
      )
      await ProductDiscountModel.updateMany(
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

module.exports = ProductDiscountController
