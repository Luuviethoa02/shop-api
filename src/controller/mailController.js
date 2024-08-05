var nodemailer = require('nodemailer')
const UserModel = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const MailController = {
  generateRandomNumbers() {
    const randomNumbers = []
    for (let i = 0; i < 5; i++) {
      const randomNumber = Math.floor(Math.random() * 9) + 1
      randomNumbers.push(randomNumber)
    }
    const result = randomNumbers.join('  ')
    return result
  },
  handleCreateAcesstoken: (code) => {
    const accessToken = jwt.sign(
      {
        code: code,
      },
      process.env.TOKEN_ACCESS_KEY_CODE,
      {
        expiresIn: '1m',
      }
    )
    return accessToken
  },
  main: async (req, res, next) => {
    try {
      const message = {}
      const email = req.body.email
      const user = await UserModel.findOne({ email: email })
      if (!user) {
        message.name = 'Email không tồn tại !'
        return res.status(401).json(message)
      } else {
        try {
          var transporter = nodemailer.createTransport({
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD_EMAIL,
            },
          })

          const code = MailController.generateRandomNumbers()

          var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'SHOP.CO mã code xác thực !',
            text: `Mã xác thực của bạn là: ${code}`,
          }
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })
          message.name = 'Gửi Mail thành công'
          message.accessTokenCode = MailController.handleCreateAcesstoken(code)
          return res.status(200).json(message)
        } catch (error) {
          return res.status(500).json(error)
        }
      }
    } catch (error) {
      console.error('Error in the main try-catch block:', error)
      return res.status(500).json(error)
    }
  },
}

module.exports = MailController
