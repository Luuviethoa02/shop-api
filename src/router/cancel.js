const express = require('express')
const CancelController = require('../controller/cancelController.js')

const router = express.Router()

router.get('/get/:id',CancelController.getByIdOders)
router.get('/getAll',CancelController.getAllOdersCancel)
router.post('/add',CancelController.addCancel)

module.exports = router
