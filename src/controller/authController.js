const UserModel = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { StatusCodes } = require('http-status-codes')
const { gennarateToken, formatResponse } = require('../helpers/index.js')

const AuthController = {
  //REGISTER USER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(req.body.password, salt)
      const user = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      })
      await user.save()
      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'đăng ký thành công',
        data: user,
      })
    } catch (error) {
      //duplicate key error
      if (error.code == 11000) {
        const valueError = Object.keys(error.keyPattern)[0]
        const message = `${valueError} ${error.keyValue[valueError]} đã tồn tại`
        return res.json({
          statusCode: StatusCodes.BAD_REQUEST,
          message: message,
          data: null,
        })
      }

      if (error.name === 'ValidationError') {
        return res.json({
          statusCode: StatusCodes.BAD_REQUEST,
          message: error.message,
        })
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Invalid request from server',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      })
    }
  },

  registerGoole: async (req, res) => {
    try {
      let userFind = await UserModel.findOne({
        email: req.body.email,
      }).populate('sellerId')
      if (!userFind) {
        const user = new UserModel({
          username: req.body.username,
          email: req.body.email,
          img: req.body.img,
          loginGoogle: true,
        })
        const { accessToken, refreshToken } = gennarateToken(user)
        const userResponse = await user.save()
        const data = {
          jwt: { accessToken, refreshToken },
          user: userResponse,
        }
        return res
          .status(StatusCodes.OK)
          .json(formatResponse(StatusCodes.OK, 'Đăng nhập thành công', data))
      }

      const { accessToken, refreshToken } = gennarateToken(userFind)
      const data = {
        jwt: { accessToken, refreshToken },
        user: userFind,
      }
      return res
        .status(StatusCodes.OK)
        .json(formatResponse(StatusCodes.OK, 'Đăng nhập thành công', data))
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Invalid request from server',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      })
    }
  },

  refereshToken: async (req, res) => {
    const requestrefreshToken = req.body.refreshToken
    if (!requestrefreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(formatResponse(StatusCodes.UNAUTHORIZED, 'Token không tồn tại !'))
    }

    jwt.verify(
      requestrefreshToken,
      process.env.TOKEN_REFRESH_KEY,
      (err, user) => {
        if (err) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(
              formatResponse(
                StatusCodes.UNAUTHORIZED,
                err || err.message || 'Token không hợp lệ !'
              )
            )
        }

        const { accessToken, refreshToken } = gennarateToken(user)
        const data = {
          jwt: { accessToken, refreshToken },
          user,
        }
        return res
          .status(StatusCodes.OK)
          .json(
            formatResponse(StatusCodes.OK, 'refresh token thành công !', data)
          )
      }
    )
  },

  //LOGIN USER
  loginUser: async (req, res) => {
    try {
      const email = req.body.email
      const user = await UserModel.findOne({ email: email }).populate(
        'sellerId'
      )

      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            formatResponse(
              StatusCodes.UNAUTHORIZED,
              'Tài khoản không tồn tại !',
              null
            )
          )
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      )

      if (!validPassword) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            formatResponse(
              StatusCodes.UNAUTHORIZED,
              'Mật khẩu không chính xác !',
              null
            )
          )
      }

      if (user && validPassword) {
        const { accessToken, refreshToken } = gennarateToken(user)
        const { password, ...userResponse } = user._doc
        const data = {
          jwt: { accessToken, refreshToken },
          user: userResponse,
        }
        return res
          .status(StatusCodes.OK)
          .json(formatResponse(StatusCodes.OK, 'Đăng nhập thành công', data))
      }
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          formatResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message || 'Invalid request from server'
          )
        )
    }
  },
  //GET USER
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: req.user.id })
      const { password, ...data } = user._doc
      return res.status(StatusCodes.OK).json(data)
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const userId = req.params.userId
      const img = req.body.img
      const userUpdate = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          img,
        },
        { new: true }
      )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật ảnh đại diện thành công',
        data: userUpdate,
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  checkUser: async (req, res) => {
    try {
      const cookie = req.cookies['jwt']
      const claims = jwt.verify(cookie, process.env.TOKEN_ACCESS_KEY)
      if (!claims) {
        return res.status(401).json({ message: 'unauthenticated' })
      }
      return res.status(200).json({ message: 'ok' })
    } catch (error) {
      return res.status(401).json({ message: 'unauthenticated' })
    }
  },
  //get all user
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find()
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json(err)
    }
  },

  //LOGOUT
  logoutUser: async (req, res) => {
    res.clearCookie('jwt')
    return res.json({
      message: 'logout success',
    })
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId
      const dataUpdate = req.body.data
      const userUpdate = await UserModel.findOneAndUpdate(userId, dataUpdate,{
        new:true
      })
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật người dùng thành công',
        data: userUpdate,
      })
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
}

module.exports = AuthController
