const { StatusCodes } = require('http-status-codes')
const BrandModel = require('../models/brandModel.js')
const { formatResponse } = require('../helpers/index.js')
const slugify = require('slugify')

const BrandController = {
  getAllBrand: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 5
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
        name: req.body.name,
        img_cover: req.file.originalname,
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
  getBrandById: async (req, res, next) => {
    const id_brand = req.params.id
    //:6570b89d467d7d916cf4eba3
    try {
      const brand = await BrandModel.findById(id_brand)
      res.status(200).json(brand)
    } catch (err) {
      res.status(500).json(err)
    }
  },
}

module.exports = BrandController
