const { StatusCodes, ReasonPhrases } = require('http-status-codes')

const SellerModel = require('../models/sellerModel.js')
const UserModel = require('../models/userModel.js')
const qs = require('qs')
const slugify = require('slugify')

const SellerController = {
  addSeller: async (req, res, next) => {
    const { userId, ...data } = req.body
    try {
      const Seller = new SellerModel({
        ...data,
        slug: slugify(req.body.businessName, { lower: true }),
      })
      const resSeller = await Seller.save()

      const resUserUpdate = await UserModel.findByIdAndUpdate(
        userId,
        {
          sellerId: resSeller._id,
        },
        { new: true }
      ).populate('sellerId')

      return res.status(StatusCodes.OK).json({
        code: 200,
        message: 'Tạo kênh bán thành công',
        data: {
          seller: resSeller,
          user: resUserUpdate,
        },
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const query = qs.parse(req.query)
      const page = query.page || 1
      const limit = query.limit || 7
      const skip = (page - 1) * limit

      const sellersTotal = await SellerModel.find().countDocuments()
      const sellers = await SellerModel.find().skip(skip).limit(limit).exec()

      const results = await Promise.all(
        sellers.map(async (seller) => {
          const userSeller = await UserModel.find({
            sellerId: seller._doc._id,
          })

          return { ...seller._doc, user: userSeller[0] }
        })
      )

      return res.status(StatusCodes.OK).json({
        page: +page,
        limit: +limit,
        total: +sellersTotal,
        data: results,
      })
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  updateStatus: async (req, res, next) => {
    try {
      const sellerId = req.params.sellerId
      const status = req.body.status
      
      const dataUpdate = await SellerModel.findByIdAndUpdate(
        sellerId,
        {
          status: status,
        },
        { new: true }
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'cập nhật trạng thái kênh bán hàng thành công',
        data: dataUpdate,
      })
    } catch (error) {
      return res.error(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
}

module.exports = SellerController
