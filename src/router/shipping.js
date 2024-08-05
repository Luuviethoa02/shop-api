const express = require('express')
const ShipingController = require('../controller/shippingController.js')

const router = express.Router()

router.get('/get/:id',ShipingController.getByIdOders)
router.get('/getAll/',ShipingController.getAllShipping)
router.post('/add',ShipingController.addShiping)

module.exports = router
