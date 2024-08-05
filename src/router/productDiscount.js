const express = require('express')
const ProductDiscountController = require('../controller/productDiscount.js')

const router = express.Router()


router.post('/add',ProductDiscountController.addproductDiscount)



module.exports = router
