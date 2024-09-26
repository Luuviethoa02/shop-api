const config = require('./config')
const axios = require('axios')
const crypto = require('crypto')
const OdersModel = require('../models/oderModel.js')
const OdersModelDetail = require('../models/oderDetailModel.js')
var nodemailer = require('nodemailer')

const BankController = {

  sendMail: (email, name, products) => {
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
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'SHOPVH - Cảm ơn bạn đã mua hàng!',
        html: BankController.productTemplatesEmail(name, products),
      }
      transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.log(error)

      return false
    }
  },

  formatNumberToVND: (price) => {
    const number = price
    if (!number) {
      return ''
    }
    return (
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(number) || 0
    )
  },

  productTemplatesEmail: (name, products) => {
    return `
  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Cảm ơn bạn đã mua hàng!</h1>
    </div>
    <div style="padding: 20px;">
        <p>Chào <strong style="text-transform: capitalize;">[${name}]</strong>,</p>
        <p>Chúng tôi xin chân thành cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm nhất có thể.</p>
        <h3 style="margin-top: 20px;">Thông tin đơn hàng:</h3>
        <ul style="list-style-type: none; padding: 10px 0; display:block;">
        ${products.map((product) => {
          return `
            <li style="border-bottom: 1px solid #ccc; margin:15px 0; padding: 10px 0;">
                <img src="${product.color.image}" alt="${
            product.product
          }" style="max-width: 80px; float: left; margin-right: 10px;">
                <strong>${
                  product.product
                }</strong> - Giá: ${BankController.formatNumberToVND(
            product.price
          )} - Số lượng: ${product.quantity}
            </li>
          `
        })}
        </ul>
        <p style="display:block; margin:10px 0;">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email hoặc số điện thoại.</p>
        <p>Chúc bạn có một ngày tuyệt vời!</p>
    </div>
    <div style="text-align: center; padding: 10px; font-size: 0.9em; color: #666;">
        <p>Trân trọng,<br>[Shopvh]</p>
    </div>
  </div>
    `
  },

  main: async (req, res, next) => {
    let {
      accessKey,
      secretKey,
      orderInfo,
      partnerCode,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      orderGroupId,
      autoCapture,
      lang,
    } = config

    const oder = req.body.oder
    const oderDetails = req.body.oderDetails

    orderInfo = `Thanh toán ${oderDetails.length} đơn hàng tại cửa hàng trực tuyến Shopvh`

    var amount = oder.totalPrice || 0
    var orderId = partnerCode + new Date().getTime()
    var requestId = orderId

    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType

    //signature
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Shopvh',
      storeId: 'ShopvhStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    })

    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    }

    // Send the request and handle the response

    let result
    try {
      result = await axios(options)
   
      const newOder = new OdersModel({
        ...oder,
        status_pay: {
          status: 'wait',
          messages: 'Chờ xác nhận thanh toán',
          payUrl: result.data.payUrl,
          oderId: orderId,
        },
      })

      const resultOder = await newOder.save()

      const userEmail = await OdersModel.findById(resultOder._id).populate(
        'user_id',
        'email username'
      )

      oderDetails.map((item) => {
        item.oder_id = resultOder._id
      })
      const resultOderDetail =await OdersModelDetail.insertMany(oderDetails)

      const resultDetailPromises = resultOderDetail.map(async (item) => {
        await addOrderNotification(
          userEmail.user_id._id,
          item._id,
          item.sellerId
        )
        try {
          io.to(item.sellerId.toString()).emit('newOrder', {
            user: userEmail.user_id,
            orderDetail: item._id,
            product: {
              product: item.product,
              quantity: item.quantity,
              color: item.color,
              size: item.size,
            },
          })
        } catch (socketError) {
          console.error(`Socket error for user ${comment.userId}:`, socketError)
        }
      })

      await Promise.all(resultDetailPromises)

      BankController.sendMail(
        userEmail.user_id.email,
        userEmail.user_id.username,
        oderDetails
      )

      return res.status(200).json(result.data)
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message })
    }
  },
  callback: async (req, res, next) => {
    console.log('callback:::::', req.body)
    return res.json({ statusCode: 200, message: 'success' })
  },
  checkStatusTransaction: async (req, res, next) => {
    const { orderId } = req.body

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    var accessKey = 'F8BBA842ECF85'
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    })

    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    }
    const result = await axios(options)
    let statusCode =
      result.data.resultCode == 1000
        ? 'wait'
        : result.data.resultCode == 0
        ? 'success'
        : 'failure'

    const statusPayUpdate = {
      status: statusCode,
      messages: result.data.message,
      oderId: orderId,
    }
    if (result.data.payUrl) {
      statusPayUpdate.payUrl = result.data.payUrl
    }

    const updateOder = await OdersModel.findOneAndUpdate(
      {
        'status_pay.oderId': orderId,
      },
      {
        status_pay: statusPayUpdate,
      },
      {
        new: true,
      }
    )
   

    return res.status(200).json({
      statusCode: 200,
      message: 'Kiểm tra ',
      data: {
        oderUpdate: updateOder,
        info_pay: result.data,
      },
    })
  },
}

module.exports = BankController
