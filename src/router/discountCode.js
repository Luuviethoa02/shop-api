const express = require('express')
const DiscountController = require('../controller/discountCode.js')

const router = express.Router()

router.post('/add',DiscountController.addDiscount)
router.put('/product/add/:discountId',DiscountController.addDiscountProduct)
router.put('/product/remove/:discountId',DiscountController.removeDiscountProduct)
router.put('/active/:discountId',DiscountController.addActiveDiscountProduct)
router.get('/:sellerId',DiscountController.getDiscountBySellerId)


module.exports = router
