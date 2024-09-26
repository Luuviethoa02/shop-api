const OdersModel = require('../models/oderModel.js')
const OdersModelDetail = require('../models/oderDetailModel.js')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const axios = require('axios')
var nodemailer = require('nodemailer')
const {
  addOrderNotification,
  deleteOrderNotification,
  updateIsReadStatus,
} = require('./orderNotificationController.js')

const OderController = {
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
        html: OderController.productTemplatesEmail(name, products),
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
        <ul style="list-style-type: none; padding: 0; display:block;">
        ${products.map((product) => {
          return `
            <li style="border-bottom: 1px solid #ccc; margin:15px 0; padding: 10px 0;">
                <img src="${product.color.image}" alt="${
            product.product
          }" style="max-width: 80px; float: left; margin-right: 10px;">
                <strong>${
                  product.product
                }</strong> - Giá: ${OderController.formatNumberToVND(
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

  updateStatusPay: async (req, res, next) => {
    try {
      const oderId = req.params.oderId
      const statusPay = req.body.status_pay
      const oderFind = await OdersModel.findByIdAndUpdate(oderId, statusPay)
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật trạng thái thanh toán thành công',
        data: oderFind,
      })
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(StatusCodes.ReasonPhrases)
    }
  },
  updateStatusOderDetailCanceled: async (req, res, next) => {
    try {
      const oderDetailId = req.params.oderDetailId
      const statusOder = req.body.status_oder

      const oderDetailFind = await OdersModelDetail.findByIdAndUpdate(
        oderDetailId,
        statusOder,
        { new: true }
      )
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: oderDetailFind,
      })
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(StatusCodes.ReasonPhrases)
    }
  },
  updateStatusOderDetail: async (req, res, next) => {
    try {
      const oderDetailId = req.params.oderDetailId
      const { status } = req.body

      let updatedStatus = {
        'status_oder.pending.status': status === 'pending',
        'status_oder.shipping.status': status === 'shipping',
        'status_oder.success.status': status === 'success',
        'status_oder.canceled.status': status === 'canceled',
      }

      if (status === 'shipping') {
        updatedStatus['status_oder.shipping.created_at'] = Date.now()
      } else if (status === 'success') {
        updatedStatus['status_oder.success.created_at'] = Date.now()
      } else if (status === 'canceled') {
        updatedStatus['status_oder.canceled.created_at'] = Date.now()
        updatedStatus['status_oder.canceled.message'] = req?.body?.messager
        updatedStatus['status_oder.canceled.created_by.infoId'] =
          req?.body?.create_by
        updatedStatus['status_oder.canceled.created_by.shopper'] =
          req?.body?.shopper //user | seller
      }

      const oderDetailFind = await OdersModelDetail.findByIdAndUpdate(
        oderDetailId,
        updatedStatus,
        { new: true }
      ).populate('sellerId', 'businessName')
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: oderDetailFind,
      })
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(StatusCodes.ReasonPhrases)
    }
  },
  addOders: async (req, res, next) => {
    try {
      const oder = req.body.oder
      const oderDetails = req.body.oderDetails
      const io = req.io

      const newOder = new OdersModel(oder)
      const resultOder = await newOder.save()

      const userEmail = await OdersModel.findById(resultOder._id).populate(
        'user_id',
        'email username img'
      )

      oderDetails.map(async (item) => {
        item.oder_id = resultOder._id
      })

      const resultOderDetail = await OdersModelDetail.insertMany(oderDetails)

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

      // OderController.sendMail(
      //   userEmail.user_id.email,
      //   userEmail.user_id.username,
      //   oderDetails
      // )

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Thêm đơn hàng thành công',
        data: { oder: resultOder, oderDetail: resultOderDetail },
      })
    } catch (err) {
      console.log(err)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
  },
  getOdersDetailbyId: async (req, res, next) => {
    try {
      const oderId = req.params.oderId
      const oderFind = await OdersModelDetail.find({
        oder_id: oderId,
      }).populate('sellerId', 'businessName logo')
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'Lấy chi tiết đơn hàng thành công',
        data: oderFind,
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },

  getAllOdersByUserId: async (req, res, next) => {
    try {
      const userId = req.params.userId
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 10
      const total = await OdersModel.find({
        user_id: userId,
      }).countDocuments()
      const odersFind = await OdersModel.find({
        user_id: userId,
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user_id', 'username img')

      return res.status(StatusCodes.OK).json({
        total: total,
        page: page,
        limit: limit,
        data: odersFind,
      })
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },

  getAllOdersBySellerId: async (req, res, next) => {
    try {
      const sellerId = req.params.sellerId
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 10
      const total = await OdersModelDetail.find({
        sellerId: sellerId,
      }).countDocuments()
      const odersFind = await OdersModelDetail.find({
        sellerId: sellerId,
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: 'oder_id',
          select: 'address_id status_pay type_pay', // First, populate 'oder_id'
          populate: {
            path: 'user_id',
            select: 'username img email',
            model: 'users',
          },
        })
        .populate('sellerId','businessName')

      return res.status(StatusCodes.OK).json({
        total: total,
        page: page,
        limit: limit,
        data: odersFind,
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  },
  getAllOdersCoditionByUserId: async (req, res, next) => {
    try {
      const userId = req.params.userId
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 10
      const total = await OdersModel.find({
        user_id: userId,
        region: 'NA',
        ...condition,
      }).countDocuments()
      const condition = req.query
      const odersFind = await OdersModel.find({
        user_id: userId,
        region: 'NA',
        ...condition,
      })
        .limit(limit)
        .skip((page - 1) * limit)

      return res.status(StatusCodes.OK).json({
        data: odersFind,
        total: total,
        page: page,
        limit: limit,
      })
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(StatusCodes.ReasonPhrases)
    }
  },
  updateAddress: async (req, res) => {
    try {
      const id = req.params.id
      await AddressModel.updateOne(
        { _id: id },
        {
          $set: { default: true },
        }
      )
      await AddressModel.updateMany(
        { _id: { $ne: id } },
        {
          $set: { default: false },
        }
      )

      return res.status(200).json({ message: 'update address successfully' })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
}

module.exports = OderController
