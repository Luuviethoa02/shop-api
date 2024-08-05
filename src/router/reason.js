const express = require('express')
const ReasonController = require('../controller/reasonController.js')

const router = express.Router()

router.get('/getAll',ReasonController.getAllReason)
router.get('/get/:id',ReasonController.getReasonById)



module.exports = router
