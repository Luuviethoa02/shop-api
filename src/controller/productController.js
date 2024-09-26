const { StatusCodes, ReasonPhrases } = require('http-status-codes')

const ProductModel = require('../models/productModel.js')
const OdersDetailModel = require('../models/oderDetailModel.js')

const slugify = require('slugify')
const SellerModel = require('../models/sellerModel.js')
const BrandModel = require('../models/brandModel.js')
const qs = require('qs')

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
                let total = 0;
                const totalColors = await OdersDetailModel.find({
                  'color._id': color._id,
                });
                if (totalColors.length > 0) {
                  total += totalColors.reduce((pre, acc) => pre + acc.quantity, 0);
                }
                return total;
              })
            );
        
            const totalSum = total.reduce((pre, acc) => pre + acc, 0); // Sum all the totals from colors
        
            return { ...product._doc, total: totalSum };
          })
        );

      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: newProduct,
      })
    } catch (err) {
      console.log(err);
      
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

      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          code: StatusCodes.OK,
          message: 'Lấy chi tiết sản phẩm thành công',
          data: {
            productDetail,
            productSimilars,
            sellerInfo,
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

      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          page,
          limit,
          total,
          data: productDetail,
        })
      }, 2000)
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  getProductBySlugCategory: async (req, res, next) => {
    try {
      const slug = req.params.slugCategory
      const query = qs.parse(req.query)

      const page = parseInt(query.page, 10) || 1
      const limit = parseInt(query.limit, 10) || 2
      const skip = (page - 1) * limit

      const brandFind = await BrandModel.find({
        slug: slug,
      })

      let productFilter = {
        brand_id: brandFind[0]._id.toString(),
      }

      // Apply dynamic filters using parsed query parameters
      if (query?.price?.min && query?.price?.max) {
        productFilter.price = {
          $gte: parseFloat(query.price.min),
          $lte: parseFloat(query.price.max),
        }
      }

      if (query?.color) {
        productFilter['colors.name'] = query.color
      }

      if (query?.size) {
        productFilter['sizes.name'] = query.size
      }

      const products = await ProductModel.find(productFilter)
        .skip(skip)
        .limit(limit)
        .populate('brand_id', 'name')

      const totalProducts = await ProductModel.find(
        productFilter
      ).countDocuments()

      setTimeout(() => {
        return res.status(StatusCodes.OK).json({
          page,
          limit,
          total: totalProducts,
          data: products,
        })
      }, 2000)
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  getProudctCondition: async (req, res, next) => {},
}

module.exports = ProductController
