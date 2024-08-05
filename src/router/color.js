const express = require('express')
const ColorController = require('../controller/colorController.js')
const Authorization = require('../middleware/auth.js')

const router = express.Router()

//get all size
router.get('/', ColorController.getAllColors)
//add size
router.post('/add', ColorController.addColor)

module.exports = router
