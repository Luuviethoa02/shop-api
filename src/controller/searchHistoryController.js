const { StatusCodes } = require('http-status-codes')
const SearchHistoryModel = require('../models/searchHistoryModel.js')
const { formatDistanceToNow } = require('date-fns')
const { vi } = require('date-fns/locale')

const SearchHistoryController = {
  add: async (req, res, next) => {
    const { keyWords, userId } = req.body
    try {
      const updatedHistory = await SearchHistoryModel.findOneAndUpdate(
        { keyWords, created_by: userId }, // Điều kiện tìm kiếm
        { $inc: { count: 1 } }, // Nếu tìm thấy, tăng count lên 1
        { new: true, upsert: true, setDefaultsOnInsert: true } // Nếu không tìm thấy thì tạo mới
      );

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Thêm lịch sử tìm kiếm thành công',
        data: updatedHistory,
      })
    } catch (err) {
      console.log(err);
      
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  getAllByUserId: async (req, res, next) => {
    const userId = req.params.userId
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const skip = (page - 1) * limit
    try {
      const searchHistories = await SearchHistoryModel.find({
        created_by: userId,
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

      const searchHistoriesWithRelativeTime = searchHistories.map(
        (searchHistory) => ({
          ...searchHistory.toObject(),
          relativeTime: formatDistanceToNow(new Date(searchHistory.createdAt), {
            addSuffix: true,
            locale: vi,
          }),
        })
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Lấy lịch sử tìm kiếm thành công',
        data: searchHistoriesWithRelativeTime,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  getTopSearchedKeywords: async (req, res, next) => {
    const limit = req.query.limit || 10
    try {
      const topSearchedKeywords = await SearchHistoryModel.aggregate([
        {
          $group: {
            _id: '$keyWords',
            total: { $sum: '$count' },
          },
        },
        {
          $sort: { total: -1 },
        },
        {
          $limit: limit,
        },
      ])

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Lấy top từ khóa tìm kiếm thành công',
        data: topSearchedKeywords,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  deleteById: async (req, res, next) => {
    const id = req.params.id
    try {

      const searchHistory = await SearchHistoryModel.findByIdAndDelete(id)

      if (!searchHistory) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Không tìm thấy lịch sử tìm kiếm',
        })
      }

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Xóa lịch sử tìm kiếm thành công',
        data: searchHistory,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  }
}

module.exports = SearchHistoryController
