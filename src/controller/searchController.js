const { StatusCodes } = require('http-status-codes')

const ProductModel = require('../models/productModel.js')
const CommentsModel = require('../models/commentsModel.js')
const DiscountModel = require('../models/discountCode')
const OdersDetailModel = require('../models/oderDetailModel.js')
const qs = require('qs')

const SearchController = {
  suggestText: async (req, res, next) => {
    try {
      const text = req.params.text

      // Tìm kiếm theo tên sản phẩm (product)
      const products = await ProductModel.find({
        name: { $regex: text, $options: 'i' },
      }).limit(10)

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Tìm kiếm thành công',
        data: products.map((product) => product.name),
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).error(error.message)
    }
  },
  searchByText: async (req, res, next) => {
    try {
      const query = qs.parse(req.query)
      const text = req.params.text
      const page = query.page || 1
      const limit = query.limit || 10
      const skip = (page - 1) * limit

      let productFilter = {}

      // Apply dynamic filters using parsed query parameters
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
        name: { $regex: text, $options: 'i' },
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

      if(query?.is_discount && query.is_discount === 'true') {
        newProduct = newProduct.filter((product) => product.discount)
      }

      return res.status(StatusCodes.OK).json({
        page: +page,
        limit: +limit,
        total: newProduct.length,
        data: newProduct,
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).error(error.message)
    }
  },
}

module.exports = SearchController
