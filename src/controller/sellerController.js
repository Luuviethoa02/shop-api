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
  updateImage: async (req, res, next) => {
    try {
      const sellerId = req.params.sellerId
      const dataUpate = {}
      if (req.body.logo) {
        dataUpate.logo = req.body.logo
      }
      if (req.body.img_cover) {
        dataUpate.img_cover = req.body.img_cover
      }
      const dataUpdate = await SellerModel.findByIdAndUpdate(
        sellerId,
        dataUpate,
        { new: true }
      )
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật ảnh kênh bán hàng thành công',
        data: dataUpdate,
      })
    } catch (error) {
      console.error('Error during image upload:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Upload failed',
        error: error.message || error,
      })
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
            _id: '$productId', // Nhóm theo productId
            quantity: { $sum: 1 }, // Đếm số lượng sản phẩm đã bán
          },
        },
        // Bước 3: Sắp xếp theo số lượng bán từ cao xuống thấp
        {
          $sort: { quantity: -1 },
        },
        // Bước 4: Giới hạn số lượng sản phẩm trả về (ví dụ: top 10)
        {
          $limit: 10,
        },
        // Bước 5: Sử dụng $lookup để "populate" productId với thông tin sản phẩm
        {
          $lookup: {
            from: 'products', // Tên collection chứa thông tin sản phẩm
            localField: '_id', // Trường productId trong OdersDetailModel
            foreignField: '_id', // Trường _id trong collection products
            as: 'product', // Tên alias cho thông tin sản phẩm
          },
        },
        // Bước 6: Dùng $unwind để chuyển mảng 'product' thành đối tượng
        {
          $unwind: '$product',
        },
      ])

      const newTopSellingProducts = await Promise.all(
        topSellingProducts.map(async (product) => {
          const productReview = await CommentsModel.find({
            productId: product._id,
          })

          const numberRatings = productReview.reduce(
            (pre, acc) => {
              if (acc.rating === 5)
                return { ...pre, five_rating: pre.five_rating + 1 }
              if (acc.rating === 4)
                return { ...pre, four_rating: pre.four_rating + 1 }
              if (acc.rating === 3)
                return { ...pre, three_rating: pre.three_rating + 1 }
              if (acc.rating === 2)
                return { ...pre, two_rating: pre.two_rating + 1 }
              if (acc.rating === 1)
                return { ...pre, one_rating: pre.one_rating + 1 }
            },
            {
              five_rating: 0,
              four_rating: 0,
              three_rating: 0,
              two_rating: 0,
              one_rating: 0,
            }
          )
          const total_point =
            numberRatings.five_rating * 5 +
            numberRatings.four_rating * 4 +
            numberRatings.three_rating * 3 +
            numberRatings.two_rating * 2 +
            numberRatings.one_rating * 1

          const total_rating =
            numberRatings.five_rating +
            numberRatings.four_rating +
            numberRatings.three_rating +
            numberRatings.two_rating +
            numberRatings.one_rating

          const average_rating =
            Number(total_rating) === 0
              ? 0
              : Number(total_point) / Number(total_rating)

          return {
            ...product,
            product: {
              ...product.product,
              average_rating,
            },
          }
        })
      )

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
        topSellingProducts: newTopSellingProducts,
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
  getAnalystics: async (req, res, next) => {
    try {
      const sellerId = req.params.sellerId

      const totalProducts = await ProductModel.find({
        sellerId: sellerId,
      }).countDocuments()

      const totalOrdersPending = await OdersDetailModel.find(
        {
          sellerId: sellerId,
          'status_oder.pending.status': true,
        },
        {
          $sort: { createdAt: -1 },
        }
      ).countDocuments()

      const totalOrdersShipping = await OdersDetailModel.find(
        {
          sellerId: sellerId,
          'status_oder.shipping.status': true,
        },
        {
          $sort: { createdAt: -1 },
        }
      ).countDocuments()

      const totalOrdersSuccess = await OdersDetailModel.find(
        {
          sellerId: sellerId,
          'status_oder.success.status': true,
        },
        {
          $sort: { createdAt: -1 },
        }
      ).countDocuments()

      const totalOrdersCanceled = await OdersDetailModel.find(
        {
          sellerId: sellerId,
          'status_oder.canceled.status': true,
        },
        {
          $sort: { createdAt: -1 },
        }
      ).countDocuments()

      const totalComments = await CommentsModel.find({
        sellerId: sellerId,
      }).countDocuments()

      const totalFollowers = await SellerModel.findById(sellerId).select(
        'followers'
      )

      const revenueProducts = await OdersDetailModel.aggregate([
        {
          $match: {
            sellerId: sellerId,
            'status_oder.success.status': true,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: { $toDate: '$createdAt' } },
              month: { $month: { $toDate: '$createdAt' } },
            },
            totalRevenue: {
              $sum: {
                $multiply: ['$price', '$quantity'],
              },
            },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ])

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Lấy thông tin phân tích kênh bán hàng thành công',
        data: {
          totalProducts,
          totalOrders: {
            totalOrdersPending,
            totalOrdersShipping,
            totalOrdersSuccess,
            totalOrdersCanceled,
          },
          totalComments,
          totalFollowers: totalFollowers.followers.length,
          revenueProducts,
        },
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
  updateInfo: async (req, res, next) => {
    try {
      const sellerId = req.params.sellerId
      const dataUpdate = await SellerModel.findByIdAndUpdate(
        sellerId,
        { $set: req.body },
        { new: true}
      )
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật thông tin kênh bán hàng thành công',
        data: dataUpdate,
      })
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  addFollower: async (req, res) => {
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
