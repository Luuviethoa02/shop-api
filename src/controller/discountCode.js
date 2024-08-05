const { StatusCodes } = require('http-status-codes')
const DiscountModel = require('../models/discountCode')
const DiscountController = {
  getDiscountBy: async (req, res, next) => {
    try {
      const user_id = req.params.id
      const DiscountFinds = await DiscountModel.find({ user_id: user_id })
      if (DiscountFinds.length > 0) {
        return res.status(200).json(DiscountFinds)
      } else {
        return res.status(200).json({ error: 'no Discount' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  getAllDiscount: async (req, res, next) => {
    try {
      const DiscountFinds = await DiscountModel.find()
      if (DiscountFinds) {
        return res.status(200).json(DiscountFinds)
      } else {
        return res.status(200).json({ error: 'no Discount' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  addDiscount: async (req, res, next) => {
    try {
      const newDiscount = new DiscountModel({
        discount_code: req.body.discount_code,
        discount_percent: req.body.discount_percent,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
      })
      const result = await newDiscount.save()
      res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Thêm mã giảm giá thành công',
        data: result,
      })
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  updateDiscount: async (req, res) => {
    try {
      const id = req.params.id
      await DiscountModel.updateOne(
        { _id: id },
        {
          $set: { default: true },
        }
      )
      await DiscountModel.updateMany(
        { _id: { $ne: id } },
        {
          $set: { default: false },
        }
      )

      return res.status(200).json({ message: 'update Discount successfully' })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
}

module.exports = DiscountController
