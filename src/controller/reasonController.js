const ReasonModel = require('../models/reasonModel.js')


const ReasonController = {
  getAllReason: async (req, res) => {
    try {
      const reasons = await ReasonModel.find()
      res.status(200).json(reasons)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getReasonById:async (req, res) => {
    try {
      const id = req.params.id
      const reasonsFind = await ReasonModel.findById(id)
      res.status(200).json(reasonsFind)
    } catch (err) {
      res.status(500).json(err)
    }
  },

}

module.exports = ReasonController;
