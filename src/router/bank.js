const express = require('express')
const BankController = require('../controller/bankController.js')

const router = express.Router()


router.post('/',BankController.main)





module.exports = router
