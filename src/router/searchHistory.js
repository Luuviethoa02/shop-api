const express = require('express')
const SearchHistoryController = require('../controller/searchHistoryController.js')

const router = express.Router()

router.post('/add',SearchHistoryController.add)
router.get('/getAll/:userId',SearchHistoryController.getAllByUserId)
router.get('/topSearch',SearchHistoryController.getTopSearchedKeywords)
router.delete('/delete/:id',SearchHistoryController.deleteById)

module.exports = router
