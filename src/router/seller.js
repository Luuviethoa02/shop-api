const express = require('express')
const SellController = require('../controller/sellerController')

const router = express.Router()

//add new sell
router.post('/add',SellController.addSeller)




module.exports = router
