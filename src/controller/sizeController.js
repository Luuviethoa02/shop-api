const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { formatResponse } = require('../helpers/index.js')
const SizeModel = require('../models/sizeModel.js')
const slugify = require('slugify')

const SizeController = {
  //get all size
  getAllSizes: async (req, res) => {
    try {
      const sizes = await SizeModel.find()
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Lấy danh sách size thành công',
        data: sizes,
      })
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
  },
  //add size
  addSize: async (req, res) => {
    try {
      const newsize = new SizeModel({
        name: req.body.name,
        slug: `size-${slugify(req.body.name, { lower: true, strict: true })}`,
      })
      const result = await newsize.save()
      res.status(StatusCodes.OK).json(
        formatResponse({
          code: StatusCodes.OK,
          message: 'Thêm size thành công',
          data: result,
        })
      )
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
}

module.exports = SizeController
