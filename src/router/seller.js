const express = require('express')
const SellController = require('../controller/sellerController')

const router = express.Router()

//add new sell
router.post('/add',SellController.addSeller)
router.get('/getAll',SellController.getAll)
router.get('/getInfo/:slug',SellController.getInfo)
router.patch('/update/:sellerId',SellController.updateStatus)
router.patch('/follower',SellController.addFollower)
router.patch('/unfollower',SellController.unFollower)




module.exports = router
