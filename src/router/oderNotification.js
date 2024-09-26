const express = require('express')
const {
  addOrderNotification,
  deleteOrderNotification,
  updateIsReadStatus,
  getAllOrderNotificationsBysellerId,
  updateStatusNotification,
  updateAllStatusBySellerId,
} = require('../controller/orderNotificationController')

const router = express.Router()

router.post('/notifications', addOrderNotification)
router.delete('/orderNotifications/:id', deleteOrderNotification)
router.patch('/orderNotifications/:id', updateIsReadStatus)
router.patch('/updateStatus/:notifiId', updateStatusNotification)
router.patch('/updateAllStatus/:sellerId', updateAllStatusBySellerId)
router.get('/getAll/:sellerId', getAllOrderNotificationsBysellerId)


module.exports = router
