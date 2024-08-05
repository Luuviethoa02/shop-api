const ShippingModel = require('../models/shippingModel.js')


const ShipingController = {
  getByIdOders: async (req, res) => {
    const oder_id = req.params.id
    try {
      const shippingFind = await ShippingModel.findOne({
        oder_id: oder_id,
      })
      res.status(200).json(shippingFind)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getAllShipping: async (req, res) => {
    try {
      const shippingFind = await ShippingModel.find()
      res.status(200).json(shippingFind)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  addShiping: async (req, res) => {
    try {
      const shippingNew = new ShippingModel({
        oder_id : req.body.oder_id,
        shipper_id : req.body.shipper_id,
      })
      shippingNew.save();
      res.status(200).json({meesssage : "thêm ShipingModel thành công",shippingNew})
    } catch (err) {
      res.status(500).json(err)
    }
  },
 
}

module.exports = ShipingController;
