const { StatusCodes } = require('http-status-codes')
const BrandModel = require('../models/brandModel.js')
const { formatResponse } = require('../helpers/index.js')
const slugify = require('slugify')

const BrandController = {
  getAllBrand: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 20
      const skip = (page - 1) * limit
      const total = await BrandModel.countDocuments().exec()

      const brands = await BrandModel.find().skip(skip).limit(limit).exec()
      return res.status(StatusCodes.OK).json({
        page,
        limit,
        total,
        data: brands,
      })
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  addBrand: async (req, res) => {
    try {
      const slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      })
      const newBrand = new BrandModel({
        ...req.body,
        slug: slug,
      })
      const result = await newBrand.save()
      res.status(StatusCodes.OK).json(
        formatResponse({
          code: StatusCodes.OK,
          message: 'Thêm danh mục thành công',
          data: result,
        })
      )
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  updateBrand : async (req, res) => {
    try {
      const slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      })
      const result = await BrandModel.findByIdAndUpdate(
        req.params.brandId,
        {
          ...req.body,
          slug: slug,
        },
        { new: true }
      )
      res.status(StatusCodes.OK).json(
        formatResponse({
          code: StatusCodes.OK,
          message: 'Cập nhật danh mục thành công',
          data: result,
        })
      )
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  getBrandById: async (req, res, next) => {
    try {
      const brand = await BrandModel.find({ slug: req.params.slug })
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Lấy chi tiết danh mục thành công',
        data: {
          categories: brand,
        },
      })
    
    } catch (err) {
      res.status(500).json(err)
    }
  },
}

module.exports = BrandController
