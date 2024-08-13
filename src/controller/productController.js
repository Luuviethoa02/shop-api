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
          select: 'name',
        })
        .populate({
          path: 'color_id',
          select: 'name',
          select: 'codeColor',
        })
        .populate({
          path: 'size_id',
          select: 'name',
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

    console.log(req.body);
    
    const name = req.body.name
    const images = req.body.images
    const brandId = req.body.brand_id
    const sizes = req.body.size_id
    const colors = req.body.color_id
    const price = req.body.price
    const des = req.body.des
    try {
      const Product = new ProductModel({
        name: name,
        images: images,
        brand_id: brandId,
        size_id: sizes,
        color_id: colors,
        price: price,
        des: des,
        slug: slugify(name, { lower: true, upper: true }),
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
    const id_product = req.params.id
    try {
      const productDetail = await ProductModel.findOne({ _id: id_product })
        .populate({
          path: 'brand_id',
          select: 'name',
        })
        .populate({
          path: 'color_id',
        })
        .populate({
          path: 'size_id',
          select: 'name',
        })
      const productImage = await ProductDetailModel.findOne({
        product_id: id_product,
      })

      const brandSome = await ProductModel.find({
        brand_id: productDetail.brand_id._id,
      })

      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Lấy chi tiết sản phẩm thành công',
        data: {
          productDetail,
          productImage: productImage ? productImage.imgs : [],
          brandSomething:
            brandSome.filter((product) => product._id !== id_product) || [],
        },
      })
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
