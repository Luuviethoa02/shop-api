const express = require('express')
const ShipperController = require('../controller/shipperController.js')

const router = express.Router()

router.get('/getAll',ShipperController.getAllShipers)
router.get('/get/:id',ShipperController.getShipperById)


module.exports = router
