const { StatusCodes } = require('http-status-codes')
const OrderNotification = require('../models/orderNotificationModel.js')
const { formatDistanceToNow } = require('date-fns')
const { vi } = require('date-fns/locale')


// Add a new notification
const addOrderNotification = async (userId, orderDetailId, sellerId) => {
  try {
    const newNotification = new OrderNotification({
      userId: userId.toString(),
      orderDetailId,
      sellerId: sellerId.toString(),
    })
    await newNotification.save()
    return newNotification
  } catch (error) {
    console.log(error)

    throw new Error('Error adding notification')
  }
}

// Delete a notification by ID
const deleteOrderNotification = async (req, res) => {
  try {
    const { id } = req.params
    await OrderNotification.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Notification deleted' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting notification', error })
  }
}

// Update isRead status
const updateIsReadStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { isRead } = req.body
    const updatedNotification = await OrderNotification.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    )
    return res.status(200).json(updatedNotification)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error updating isRead status', error })
  }
}

const getAllOrderNotificationsBysellerId = async (req, res) => {
  const { sellerId } = req.params
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  try {
    const notifications = await OrderNotification.find({ sellerId: sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', {
        _id: 1,
        username: 1,
        img: 1,
      })
      .populate('orderDetailId',{
        _id: 1,
        quantity: 1,
        color: 1,
      })

      const notificationsWithRelativeTime = notifications.map((notification) => ({
        ...notification.toObject(),
        relativeTime: formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
          locale: vi,
        }),
      }))
      
    return res.status(StatusCodes.OK).json({
      message: 'Lấy thông báo thành công',
      statusCode: StatusCodes.OK,
      data: notificationsWithRelativeTime,
    })
  } catch (error) {
    console.log(error);
    
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error getting notifications', error })
  }
}

const updateStatusNotification = async (req, res) => {
  try {
    const { notifiId } = req.params
    const updatedNotification = await OrderNotification.findByIdAndUpdate(
      notifiId,
      { isRead: true },
      { new: true }
    )
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật trạng thái thông báo thành công',
      statusCode: StatusCodes.OK,
      data: updatedNotification,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error updating status notification', error })
  }
}
const updateAllStatusBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params
    const updatedNotification = await OrderNotification.updateMany(
      { sellerId: sellerId },
      { isRead: true },
      { new: true }
    )
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật tất cả trạng thái thông báo thành công',
      statusCode: StatusCodes.OK,
      data: updatedNotification,
    })
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Error updating status notification', error })
  }
}
module.exports = {
  addOrderNotification,
  deleteOrderNotification,
  updateIsReadStatus,
  getAllOrderNotificationsBysellerId,
  updateStatusNotification,
  updateAllStatusBySellerId,
}
