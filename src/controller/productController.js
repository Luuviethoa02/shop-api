const { StatusCodes, ReasonPhrases } = require('http-status-codes')

const { formatResponse } = require('../helpers/index.js')
const ProductModel = require('../models/productModel.js')

const slugify = require('slugify')

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
        .skip(skip)
        .limit(limit)
        .exec()

      res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: products,
      })
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
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
        code: 200,
        message: 'Thêm sản phẩm thành công',
        data: resProduct,
      })
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  editProduct: async (req, res, next) => {
    const id = req.params.id
    const dataUpdated = req.body
    try {
      const ress = await ProductModel.findOneAndUpdate({ _id: id }, dataUpdated)
      return res.json({ message: 'cập nhật sản phẩm thành công', ress })
    } catch (err) {
      res.status(500).json(err)
    }

    return res.json('dsfs')
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
      return res.status(200).json({ message: 'xóa sản phẩm thành công', ress })
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

      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          code: StatusCodes.OK,
          message: 'Lấy chi tiết sản phẩm thành công',
          data: {
            productDetail,
            productSimilars,
          },
        })
      }, 2000)
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
  },
  getProudctDetailByIdSeller: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 2
      const skip = (page - 1) * limit
      const sellerId = req.params.sellerId
      const total = await ProductModel.find({ sellerId })
        .countDocuments()
        .exec()

      const productDetail = await ProductModel.find({
        sellerId,
      })
        .populate({
          path: 'brand_id',
        })
        .skip(skip)
        .limit(limit)
        .exec()

      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          page,
          limit,
          total,
          data: productDetail,
        })
      }, 2000)
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
  },
}

module.exports = ProductController
