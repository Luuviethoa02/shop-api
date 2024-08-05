const express = require('express')
const OderDetailController = require('../controller/oderDetailController.js')

const router = express.Router()

router.post('/add',OderDetailController.addOdersDetail)
router.put('/updateAll',OderDetailController.updateOdersDetail)
router.get('/get/:id',OderDetailController.getOdersDetailByIdOder)
router.get('/getAll',OderDetailController.getOdersDetailAll)
router.get('/getId/:id',OderDetailController.getOdersDetailById)


module.exports = router
