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
      const user = await UserModel.findOne({ email: email })

      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            formatResponse(
              StatusCodes.UNAUTHORIZED,
              'Tài khoản không tồn tại !',
              null,
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
              null,
            )
          )
      }

      if (user && validPassword) {
        const { accessToken, refreshToken } = gennarateToken(user)
        const { password, ...userResponse } = user._doc
        const data = {
          jwt: { accessToken, refreshToken },
          user:userResponse,
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
  //CHECK USER
  CheckUser: async (req, res) => {
    try {
      const message = {}
      const email = req.body.email
      const user = await UserModel.findOne({ email: email })

      if (!user) {
        message.name = 'Tài khoản chưa tồn tại !'
        return res.status(401).json(message)
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      )

      if (!validPassword) {
        message.name = 'Mật khẩu không chính xác !'
        return res.status(401).json(message)
      }

      if (user && validPassword) {
        const accessToken = AuthController.handleCreateAcesstoken(user)

        message.name = 'Đăng nhập thành công !'
        res.cookie('jwt', accessToken, {
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: 'None',
        })

        return res.status(200).json({ accessToken, message })
      }
    } catch (err) {
      return res.status(500).json(err)
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
      const email = req.body.email
      const passNew = req.body.passNew
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(passNew, salt)
      const user = await UserModel.updateOne(
        { email: email },
        { password: hashed }
      )
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  },
}

module.exports = AuthController
