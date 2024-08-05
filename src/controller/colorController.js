const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const ColorModel = require('../models/colorModel.js')
const slugify = require('slugify')
const { formatResponse } = require('../helpers/index.js')
const ColorController = {
  //get all size
  getAllColors: async (req, res) => {
    try {
      const colors = await ColorModel.find()
      res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        message: 'Lấy danh sách color thành công',
        data: colors,
      })
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
  },
  //add size
  addColor: async (req, res) => {
    try {
      const newcolor = new ColorModel({
        name: req.body.name,
        codeColor: req.body.codeColor,
        slug: `color-${slugify(req.body.name, { lower: true, strict: true })}`,
      })
      const result = await newcolor.save()
      return res.status(StatusCodes.OK).json(
        formatResponse({
          code: StatusCodes.OK,
          message: 'Thêm màu thành công',
          data: result,
        })
      )
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
}

module.exports = ColorController
