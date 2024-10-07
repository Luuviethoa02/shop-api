const express = require('express')
const SellController = require('../controller/sellerController')

const router = express.Router()

//add new sell
router.post('/add',SellController.addSeller)
router.get('/getAll',SellController.getAll)
router.patch('/update/:sellerId',SellController.updateStatus)




module.exports = router
