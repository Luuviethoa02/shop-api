const CancelModel = require('../models/cancelModel.js')


const CancelController = {
  getByIdOders: async (req, res) => {
    const oder_id = req.params.id
    try {
      const cancelFind = await CancelModel.findOne({
        oder_id: oder_id,
      })
      res.status(200).json(cancelFind)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getAllOdersCancel: async (req, res) => {
    try {
      const cancelFinds = await CancelModel.find()
      res.status(200).json(cancelFinds)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  addCancel: async (req, res) => {
    try {
      const cancelNew = new CancelModel({
        oder_id : req.body.oder_id,
        reason_id : req.body.reason_id
      })
      cancelNew.save();
      res.status(200).json({meesssage : "thêm cancel thành công",cancelNew})
    } catch (err) {
      res.status(500).json(err)
    }
  },
 
}

module.exports = CancelController;
