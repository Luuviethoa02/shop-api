const express = require('express')
const OderController = require('../controller/oderController.js')

const router = express.Router()


router.post('/add',OderController.addOders)
router.get('/get/:id',OderController.getOdersbyId)
router.get('/getAll',OderController.getAllOders)


module.exports = router
