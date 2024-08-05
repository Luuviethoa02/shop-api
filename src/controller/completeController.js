const CompleteModel = require('../models/completeModel.js')


const CompleteController = {
  getByIdOders: async (req, res) => {
    const oder_id = req.params.id
    try {
      const completeFind = await CompleteModel.findOne({
        oder_id: oder_id,
      })
      res.status(200).json(completeFind)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getAllComplete: async (req, res) => {
    try {
      const completeFind = await CompleteModel.find()
      res.status(200).json(completeFind)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  addComplete: async (req, res) => {
    console.log(req.body.oder_id,);
    try {
      const completeNew = new CompleteModel({
        oder_id : req.body.oder_id,
      })
      completeNew.save();
      res.status(200).json({meesssage : "thêm addComplete thành công",completeNew})
    } catch (err) {
      res.status(500).json(err)
    }
  },
 
}

module.exports = CompleteController;
