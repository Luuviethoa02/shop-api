const express = require('express')
const SizeController = require('../controller/sizeController.js')

const router = express.Router()

//get all size
router.get('/',SizeController.getAllSizes)
//add size
router.post('/add',SizeController.addSize)



module.exports = router
