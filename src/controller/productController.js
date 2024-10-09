const { StatusCodes, ReasonPhrases } = require('http-status-codes')

const ProductModel = require('../models/productModel.js')
const OdersDetailModel = require('../models/oderDetailModel.js')
const DiscountModel = require('../models/discountCode')

const slugify = require('slugify')
const SellerModel = require('../models/sellerModel.js')
const BrandModel = require('../models/brandModel.js')
const qs = require('qs')
const { checkDateStatus } = require('../helpers/index')
const CommentsModel = require('../models/commentsModel.js')

const ProductController = {
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 2
      const skip = (page - 1) * limit
      const total = await ProductModel.countDocuments().exec()

      const products = await ProductModel.find()
        .populate({
          path: 'brand_id',
        })
        .populate('sellerId', 'city')
        .skip(skip)
        .limit(limit)
        .exec()

      const newProduct = await Promise.all(
        products.map(async (product) => {
          const total = await Promise.all(
            product.colors.map(async (color) => {
              let total = 0
              const totalColors = await OdersDetailModel.find({
                'color._id': color._id,
              })
              if (totalColors.length > 0) {
                total += totalColors.reduce((pre, acc) => pre + acc.quantity, 0)
              }
              return total
            })
          )
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

          const totalSum = total.reduce((pre, acc) => pre + acc, 0) // Sum all the totals from colors

          const productDiscount = await DiscountModel.find({
            is_active: 'active',
          })

          const discount = productDiscount.find((discount) => {
            return discount.productIds.includes(product._id)
          })

          if (discount) {
            return {
              ...product._doc,
              total: totalSum,
              discount: discount.discount_percentage,
              average_rating,
            }
          }

          return { ...product._doc, total: totalSum, average_rating }
        })
      )

      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: newProduct,
      })
    } catch (err) {
      console.log(err)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },

  getAllProductsDiscount: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 2
      const skip = (page - 1) * limit
      const total = await ProductModel.countDocuments().exec()

      const products = await ProductModel.find()
        .populate({
          path: 'brand_id',
        })
        .populate('sellerId', 'city')
        .skip(skip)
        .limit(limit)
        .exec()


      const newProduct = await Promise.all(
        products.map(async (product) => {
          const total = await Promise.all(
            product.colors.map(async (color) => {
              let total = 0
              const totalColors = await OdersDetailModel.find({
                'color._id': color._id,
              })
              if (totalColors.length > 0) {
                total += totalColors.reduce((pre, acc) => pre + acc.quantity, 0)
              }
              return total
            })
          )

          const totalSum = total.reduce((pre, acc) => pre + acc, 0) // Sum all the totals from colors

          return { ...product._doc, total: totalSum }
        })
      )

      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: newProduct,
      })
    } catch (err) {
      console.log(err)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  updateProduct: async (req, res, next) => {
    const productId = req.params.productId
    const dataUpdated = req.body

    try {
      if (dataUpdated.name) {
        dataUpdated.lug = slugify(dataUpdated.name, { lower: true })
      }

      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: productId },
        dataUpdated, // Apply the updates including the slug
        { new: true } // Return the updated document
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật sản phẩm thành công',
        data: updatedProduct,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  updateProductInactive: async (req, res, next) => {
    const productId = req.params.productId
    const status = req.body.status
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: productId },
        { status },
        { new: true }
      )
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật trạng thái sản phẩm thành công',
        data: updatedProduct,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const Product = new ProductModel({
        ...req.body,
        slug: slugify(req.body.name, { lower: true, upper: true }),
      })
      const resProduct = await Product.save()
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Thêm sản phẩm thành công',
        data: resProduct,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  editProduct: async (req, res, next) => {
    const id = req.params.id
    const dataUpdated = req.body
    try {
      const ress = await ProductModel.findOneAndUpdate({ _id: id }, dataUpdated)
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'cập nhật sản phẩm thành công',
        data: ress,
      })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  editColorProduct: async (req, res) => {
    const colorId = req.params.id
    const productId = req.body.productId
    const dataUpdated = req.body

    try {
      // Tìm sản phẩm trước khi cập nhật
      const product = await ProductModel.findOne({
        _id: productId,
        'colors._id': colorId,
      })

      // Kiểm tra nếu sản phẩm hoặc màu không tồn tại
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Sản phẩm hoặc màu sắc không tồn tại',
          statusCode: StatusCodes.NOT_FOUND,
        })
      }

      // Tìm màu cần cập nhật
      const color = product.colors.id(colorId)

      // Cập nhật các trường có sự thay đổi
      if (dataUpdated.name) color.name = dataUpdated.name
      if (dataUpdated.quantity) color.quantity = dataUpdated.quantity
      if (dataUpdated.image) color.image = dataUpdated.image

      // Lưu lại sản phẩm sau khi đã cập nhật
      await product.save()

      return res.status(StatusCodes.OK).json({
        message: 'Cập nhật màu sản phẩm thành công',
        statusCode: StatusCodes.OK,
        color: product, // Trả về màu đã được cập nhật
      })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
  updateImageColorProduct: async (req, res, next) => {
    const colorId = req.params.id
    const image = req.body.image
    const productId = req.body.productId
    try {
      const ress = await ProductModel.findOneAndUpdate(
        { _id: productId, 'colors._id': colorId },
        { $set: { 'colors.$.image': image } }
      )
      return res
        .status(200)
        .json({ message: 'cập nhật ảnh màu thành công', ress })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  deleteProduct: async (req, res, next) => {
    const product_id = req.params.id
    try {
      const ress = await ProductModel.findOneAndDelete({ _id: product_id })
      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa sản phẩm thành công',
        data: ress,
      })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  getProudctDetailById: async (req, res, next) => {
    try {
      const productDetail = await ProductModel.findOne({
        slug: req.params.slug,
      }).populate({
        path: 'brand_id',
        select: 'name',
        selected: 'img_cover',
      })

      const productSimilars = await ProductModel.find({
        brand_id: productDetail.brand_id,
      })

      const sellerInfo = await SellerModel.findById(productDetail.sellerId)

      const productSellerTotal = await ProductModel.find({
        sellerId: sellerInfo._id,
      }).countDocuments()

      let newSellerInfo = {
        ...sellerInfo._doc,
        totalProducts: productSellerTotal,
      }

      // const statusFollower = sellerInfo

      const productDiscount = await DiscountModel.find({
        is_active: 'active',
        productIds: { $in: [productDetail._id] },
      })

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

      productDetail.discount = productDiscount || null

      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Lấy chi tiết sản phẩm thành công',
        data: {
          productDetail,
          productSimilars,
          sellerInfo: newSellerInfo,
        },
      })
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR || error)
    }
  },
  getProudctDetailByIdSeller: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 2
      const status = req.query.status || 'active'
      const skip = (page - 1) * limit
      const sellerId = req.params.sellerId
      const total = await ProductModel.find({
        sellerId,
        status,
      }).countDocuments()

      const productDetail = await ProductModel.find({
        sellerId,
        status,
      })
        .populate({
          path: 'brand_id',
        })
        .skip(skip)
        .limit(limit)

      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: productDetail,
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  getProductBySlugCategory: async (req, res, next) => {
    try {
      const query = qs.parse(req.query)
      const page = parseInt(query.page, 10) || 1
      const limit = parseInt(query.limit, 10) || 2
      const skip = (page - 1) * limit

      let productFilter = {}

      if (query?.categoris && Array.isArray(query.categoris)) {
        productFilter.brand_id = { $in: query.categoris }
      }
      if (query?.minPrice && query?.maxPrice) {
        productFilter.price = {
          $gte: parseFloat(query?.minPrice),
          $lte: parseFloat(query?.maxPrice),
        }
      }

      if (query?.color) {
        // Tạo mảng các đối tượng tìm kiếm với $regex cho từng màu
        const colorFilters = query.color.map((color) => ({
          'colors.name': { $regex: color, $options: 'i' }, // Tìm kiếm không phân biệt hoa thường
        }))

        // Sử dụng $or để tìm kiếm các sản phẩm có màu chứa chuỗi trong query.color
        productFilter.$or = colorFilters
      }

      // Tìm kiếm theo tên sản phẩm (product)
      const products = await ProductModel.find({
        ...productFilter,
      })
        .populate({
          path: 'brand_id',
        })
        .populate('sellerId', 'city')
        .skip(skip)
        .limit(limit)
        .exec()

      if (products.length === 0) {
        return res.status(StatusCodes.OK).json({
          page: page,
          limit: limit,
          total: 0,
          data: [],
        })
      }

      let newProduct = await Promise.all(
        products.map(async (product) => {
          const total = await Promise.all(
            product.colors.map(async (color) => {
              let total = 0
              const totalColors = await OdersDetailModel.find({
                'color._id': color._id,
              })
              if (totalColors.length > 0) {
                total += totalColors.reduce((pre, acc) => pre + acc.quantity, 0)
              }
              return total
            })
          )
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

          const totalSum = total.reduce((pre, acc) => pre + acc, 0) // Sum all the totals from colors

          const productDiscount = await DiscountModel.find({
            is_active: 'active',
          })

          const discount = productDiscount.find((discount) => {
            return discount.productIds.includes(product._id)
          })

          if (discount) {
            return {
              ...product._doc,
              total: totalSum,
              discount: discount.discount_percentage,
              average_rating,
            }
          }

          return { ...product._doc, total: totalSum, average_rating }
        })
      )

      if (query?.province) {
        newProduct = newProduct.filter((product) =>
          query.province.includes(product.sellerId.city)
        )
      }

      if (query?.rating && query.rating > 1) {
        newProduct = newProduct.filter(
          (product) => product.average_rating >= query.rating
        )
      }

      if (query?.sort) {
        if (query.sort === 'price_asc') {
          newProduct.sort((a, b) => a.price - b.price)
        } else if (query.sort === 'price_desc') {
          newProduct.sort((a, b) => b.price - a.price)
        } else if (query.sort === 'rating') {
          newProduct.sort((a, b) => b.average_rating - a.average_rating)
        } else if (query.sort === 'total') {
          newProduct.sort((a, b) => b.total - a.total)
        }
      }

      if (query?.is_discount && query.is_discount === 'true') {
        newProduct = newProduct.filter((product) => product.discount)
      }

      return res.status(StatusCodes.OK).json({
        page: +page,
        limit: +limit,
        total: newProduct.length,
        data: newProduct,
      })
    } catch (error) {
      console.log(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  getProudctCondition: async (req, res, next) => {},
}

module.exports = ProductController
