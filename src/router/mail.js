const express = require('express')
const MailController = require('../controller/mailController.js')

const router = express.Router()

router.post('/', MailController.main)

module.exports = router
