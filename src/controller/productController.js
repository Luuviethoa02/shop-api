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
    const avt = req.body.avt
    const name = req.body.name
    const priceNew = parseInt(req.body.price)
    const priceOld = req.body.price_old == '' ? 0 : parseInt(req.body.price_old)
    const brandId = req.body.brand_id
    const sizes = JSON.parse(req.body.sizes)
    const colors = JSON.parse(req.body.colors)
    const des = req.body.des
    const dataUpdated = {
      name: name,
      avt: avt,
      price: priceNew,
      price_old: priceOld,
      des: des,
      brand_id: brandId,
      size_id: sizes,
      color_id: colors,
    }
    try {
      const ress = await ProductModel.findOneAndUpdate({ _id: id }, dataUpdated)
      return res.json({ message: 'cập nhật sản phẩm thành công', ress })
    } catch (err) {
      res.status(500).json(err)
    }

    return res.json('dsfs')
  },
  editColorProduct: async () =>{
    const id = req.params.id
    const colors = JSON.parse(req.body.colors)
    try {
      const ress = await ProductModel
    } catch (error) {
      return ress.status(500).json(error)
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
      return res.status(200).json({ message: 'cập nhật ảnh màu thành công', ress })
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

  // getBrandById : async(req, res,next) => {
  //   const id_brand =  req.params.id;
  //   //:6570b89d467d7d916cf4eba3
  //   try {
  //     const brand = await BrandModel.findById(id_brand)
  //     res.status(200).json(brand)
  //   } catch (err) {
  //     res.status(500).json(err)
  //   }
  // },
}

module.exports = ProductController
