const { StatusCodes } = require('http-status-codes')

const SellerModel = require('../models/sellerModel.js')
const UserModel = require('../models/userModel.js')
const ProductModel = require('../models/productModel.js')
const qs = require('qs')
const slugify = require('slugify')
const OdersDetailModel = require('../models/oderDetailModel.js')
const CommentsModel = require('../models/commentsModel.js')
const DiscountModel = require('../models/discountCode')
const { formatDistanceToNow } = require('date-fns')
const { vi } = require('date-fns/locale')

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
  getInfo: async (req, res, next) => {
    try {
      const slug = req.params.slug
      const sellerInfo = await SellerModel.findOne({ slug: slug })

      const user = await UserModel.findOne({
        sellerId: sellerInfo._id,
      })

      const productSellerTotal = await ProductModel.find({
        sellerId: sellerInfo._id,
      }).countDocuments()

      const topSellingProducts = await OdersDetailModel.aggregate([
        // Bước 1: Lọc những đơn hàng có status_oder.success.status là true
        {
          $match: {
            sellerId: sellerInfo._id,
            'status_oder.success.status': true,
          },
        },
        // Bước 2: Nhóm theo productId và đếm số lượng sản phẩm đã bán
        {
          $group: {
            _id: '$productId', // Nhóm theo productId hoặc trường đại diện sản phẩm
            quantity: { $sum: 1 }, // Đếm số lượng sản phẩm bán được
          },
        },
        // Bước 3: Sắp xếp theo số lượng bán từ cao xuống thấp
        {
          $sort: { quantity: -1 },
        },
        // Bước 4: Giới hạn số lượng sản phẩm trả về (nếu cần, ví dụ top 10)
        {
          $limit: 10,
        },
      ])

      const commentRecents = await CommentsModel.find({
        sellerId: sellerInfo._id,
      })
        .sort({ createAt: -1 })
        .limit(5)
        .populate({
          path: 'userId',
          select: 'name img _id email username',
        })

      const commentsWithRelativeTime = commentRecents.map((comment) => ({
        ...comment.toObject(),
        relativeTime: formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
          locale: vi,
        }),
      }))

      const productDiscountRecents = await DiscountModel.find({
        sellerId: sellerInfo._id,
        is_active: 'active',
        productIds: { $exists: true, $ne: [] },
      })
        .sort({ createAt: -1 })
        .limit(5)
        .populate({
          path: 'productIds', // Populate các productIds
        })

      let newSellerInfo = {
        ...sellerInfo._doc,
        user,
        totalProducts: productSellerTotal,
        topSellingProducts,
        commentRecents: commentsWithRelativeTime,
        productDiscountRecents,
      }

      const totalReviews = await CommentsModel.aggregate([
        // Bước 1: Lọc các comment theo sellerId
        {
          $match: { sellerId: sellerInfo._id },
        },
        // Bước 2: Tính tổng số sao và số lượng comment
        {
          $group: {
            _id: null,
            totalStars: { $sum: '$rating' }, // Giả sử trường "rating" là số sao trong comment
            totalComments: { $sum: 1 },
          },
        },
      ])

      // Kiểm tra kết quả
      if (totalReviews.length > 0) {
        const { totalStars, totalComments } = totalReviews[0]
        const averageRating = totalStars / totalComments
        newSellerInfo.totalComments = totalComments
        newSellerInfo.averageRating = averageRating
      } else {
        newSellerInfo.totalComments = 0
        newSellerInfo.averageRating = 0
      }

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Lấy thông tin kênh bán hàng thành công',
        data: newSellerInfo,
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
      console.log(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  addFollower: async (req, res, next) => {
    try {
      const { sellerId, userId } = req.body

      const sellerUpdate = await SellerModel.findByIdAndUpdate(
        sellerId,
        {
          $push: { followers: { _id: userId, createAt: Date.now() } },
        },
        { new: true }
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Theo dõi kênh bán hàng thành công',
        data: sellerUpdate,
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  unFollower: async (req, res, next) => {
    try {
      const { sellerId, userId } = req.body
      const sellerUpdate = await SellerModel.findByIdAndUpdate(
        sellerId,
        {
          $pull: { followers: { _id: userId } },
        },
        { new: true }
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Bỏ theo dõi kênh bán hàng thành công',
        data: sellerUpdate,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
}

module.exports = SellerController
