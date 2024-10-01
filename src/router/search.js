const express = require('express')
const SearchController = require('../controller/searchController.js')

const router = express.Router()

router.get('/:text', SearchController.suggestText)
router.get('/product/:text', SearchController.searchByText)

module.exports = router
