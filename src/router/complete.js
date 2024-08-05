const express = require('express')
const CompleteController = require('../controller/completeController.js')

const router = express.Router()

router.get('/get/:id',CompleteController.getByIdOders)
router.get('/getAll',CompleteController.getAllComplete)
router.post('/add',CompleteController.addComplete)
module.exports = router
