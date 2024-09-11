const { StatusCodes } = require('http-status-codes')
const DiscountModel = require('../models/discountCode')
const voucherCodes = require('voucher-code-generator')

const DiscountController = {
  createCode: () => {
    const codes = voucherCodes.generate({
      length: 8,
      count: 1,
      charset: 'alphanumeric',
    })
    return codes
  },
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

  addActiveDiscountProduct: async (req, res, next) => {
    try {
      const discountId = req.params.discountId
      const ress = await DiscountModel.findByIdAndUpdate(
        discountId,
        {
          $set: { is_active: 'active' },
        },
        { new: true }
      )
      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          code: StatusCodes.OK,
          message: 'Kích hoạt mã giảm giá thành công',
          data: ress,
        })
      }, 3000)
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },

  addDiscount: async (req, res) => {
    try {
      const voucherCode = DiscountController.createCode()
      const data = {
        ...req.body,
        discount_code: voucherCode[0],
      }
      const newDiscount = new DiscountModel(data)
      const result = await newDiscount.save()
      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          code: StatusCodes.OK,
          message: 'Tạo mã giảm giá thành công',
          data: result,
        })
      }, 7000)
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  addDiscountProduct: async (req, res, next) => {
    try {
      const productIds = req.body.productIds
      const discountId = req.params.discountId
      const ress = await DiscountModel.findByIdAndUpdate(
        discountId,
        {
          $push: { productIds: { $each: productIds } }, // Dùng $each để thêm từng phần tử của mảng productIds
        },
        { new: true } // Tùy chọn để trả về document đã được cập nhật
      )
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Thêm sản phẩm vào mã giảm giá thành công',
        data: ress,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  removeDiscountProduct: async (req, res, nex) => {
    try {
      const productIds = req.body.productIds
      const discountId = req.params.discountId
      const ress = await DiscountModel.findByIdAndUpdate(
        discountId,
        {
          $pull: { productIds: { $in: productIds } }, // Dùng $in để xóa các phần tử có trong mảng productIds
        },
        { new: true } // Tùy chọn để trả về document đã được cập nhật
      )
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Xóa sản phẩm khỏi mã giảm giá thành công',
        data: ress,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  getDiscountBySellerId: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 10
      const skip = (page - 1) * limit
      const sellerId = req.params.sellerId

      const total = await DiscountModel.find({ sellerId })
        .countDocuments()
        .exec()

      const DiscountFinds = await DiscountModel.find({ sellerId })
        .populate({ path: 'productIds' })
        .skip(skip)
        .limit(limit)
        .exec()

      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: DiscountFinds,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
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
