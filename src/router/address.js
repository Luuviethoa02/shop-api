const express = require('express')
const AddressController = require('../controller/addressController.js')

const router = express.Router()

router.get('/:id',AddressController.getAddressBy)
router.get('/getAll/address',AddressController.getAllAddress)
router.get('/edit/:id',AddressController.updateAddress)
router.post('/add',AddressController.addAddress)
router.put('/default',AddressController.setAddressDefault)
router.patch('/update/:addressId',AddressController.updateAddress)
router.delete('/delete/:addressId',AddressController.deleteAddress)


module.exports = router
