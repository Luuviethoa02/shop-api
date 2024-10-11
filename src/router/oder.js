const express = require('express')
const OderController = require('../controller/oderController.js')
const BankController = require('../controller/bankController.js')

const router = express.Router()


router.post('/add',OderController.addOders)
router.get('/getDetail/:oderId',OderController.getOdersDetailbyId)
router.get('/getAlldetail/:sellerId',OderController.getAllOdersBySellerId)
router.get('/getOrderDetailById/:sellerId/:orderDetailId',OderController.orderDetailId)
router.get('/getAll/:userId',OderController.getAllOdersByUserId)
router.get('/getCondition/:userId',OderController.getAllOdersCoditionByUserId)
router.patch('/update/statusPay/:oderId',OderController.updateStatusPay)
router.patch('/update/statusOder/:oderDetailId',OderController.updateStatusOderDetail)


module.exports = router
