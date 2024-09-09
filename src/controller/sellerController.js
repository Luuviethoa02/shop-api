const { StatusCodes, ReasonPhrases } = require('http-status-codes')

const { formatResponse } = require('../helpers/index.js')
const SellerModel = require('../models/sellerModel.js')
const UserModel = require('../models/userModel.js')

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
      
      const resUserUpdate = await UserModel.findByIdAndUpdate(userId, {
        sellerId: resSeller._id,
      }, { new: true }).populate('sellerId');

      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          code: 200,
          message: 'Tạo kênh bán thành công',
          data: {
            seller: resSeller,
            user: resUserUpdate,
          },
        })
      }, 2000)
    } catch (err) {

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
}

module.exports = SellerController
