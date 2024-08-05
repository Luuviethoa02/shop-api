const ShipperModel = require('../models/shipperModel.js')


const ShipperController = {
  getAllShipers: async (req, res) => {
    try {
      const shippers = await ShipperModel.find()
      res.status(200).json(shippers)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getShipperById: async (req, res) => {
    try {
      const shipper_id = req.params.id
      const shippers = await ShipperModel.findById(shipper_id)
      res.status(200).json(shippers)
    } catch (err) {
      res.status(500).json(err)
    }
  },
 
 
}

module.exports = ShipperController;
