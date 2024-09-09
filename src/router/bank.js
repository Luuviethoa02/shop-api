const express = require('express')
const BankController = require('../controller/bankController.js')

const router = express.Router()


router.post('/v1/payment',BankController.main)
// router.post('/callback',BankController.callback)
router.post('/v1/check-status-transaction',BankController.checkStatusTransaction)





module.exports = router
