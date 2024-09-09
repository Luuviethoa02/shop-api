var nodemailer = require('nodemailer')
const UserModel = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')


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
  emailTemplate: (code) => `
  <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #ddd;">
      <div style="text-align: center;">
        <img alt="Shopvh" src="/imgs/logo.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;" />
      </div>
      <h2 style="color: #333;">Mã xác thực của bạn</h2>
      <p style="font-size: 16px; color: #555;">
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là mã xác thực của bạn:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; background-color: #F97316; color: white; padding: 10px 20px; font-size: 24px; border-radius: 5px;">
          ${code}
        </span>
      </div>
      <p style="font-size: 14px; color: #777;">
        Mã xác thực này có hiệu lực trong vòng 10 phút. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
      </p>
    </div>
  </div>
`,
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
            subject: 'SHOP.CO - mã code xác thực !',
            html: MailController.emailTemplate(code),
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
          return res.status(StatusCodes.OK).json({
            statusCode:StatusCodes.OK,
            message: message.name,
            data: message.accessTokenCode
          })
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
