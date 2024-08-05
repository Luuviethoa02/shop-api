const express = require('express')
const AddressController = require('../controller/addressController.js')

const router = express.Router()


router.get('/:id',AddressController.getAddressBy)
router.get('/getAll/address',AddressController.getAllAddress)
router.get('/edit/:id',AddressController.updateAddress)
router.post('/add',AddressController.addAddress)




module.exports = router
