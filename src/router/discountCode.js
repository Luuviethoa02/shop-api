const express = require('express')
const DiscountController = require('../controller/discountCode.js')

const router = express.Router()

router.post('/add',DiscountController.addDiscount)


module.exports = router
