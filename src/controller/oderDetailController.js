const OdersDetailModel = require('../models/oderDetailModel.js')
const OderDetailController = {
  getOdersDetailByIdOder: async (req, res, next) => {
    try {
      const oder_id = req.params.id
      const oderDetailFinds = await OdersDetailModel.find({ oder_id: oder_id })
      if (oderDetailFinds) {
        return res.status(200).json(oderDetailFinds)
      } else {
        return res.status(200).json({ error: 'no oderDetailFinds' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  getOdersDetailAll: async (req, res, next) => {
    try {
      const oderDetailFinds = await OdersDetailModel.find()
      if (oderDetailFinds) {
        return res.status(200).json(oderDetailFinds)
      } else {
        return res.status(200).json({ error: 'no oderDetailFinds' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  getOdersDetailById: async (req, res, next) => {
    try {
      const id = req.params.id
      const oderDetailFinds = await OdersDetailModel.findById(id)
      if (oderDetailFinds) {
        return res.status(200).json(oderDetailFinds)
      } else {
        return res.status(200).json({ error: 'no oderDetailFinds' })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  addOdersDetail: (req, res, next) => {
    try {
      const newOderDetail = new OdersDetailModel({
        oder_id: req.body.oder_id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        color_id: req.body.color_id,
        size_id: req.body.size_id,
        type_tranfer: Boolean(req.body.type_tranfer),
        status: Number(req.body.status),
      })
      newOderDetail.save()
      res.status(200).json('thêm oder detail thành công')
    } catch (err) {
      res.status(500).json(err)
    }
  },
  updateOdersDetail: async (req, res, next) => {
    try {
      const oder_id = req.body.oder_id
      const statusNew = req.body.statusNew
      const oderDetailFinds = await OdersDetailModel.find()
      const tt = oderDetailFinds
        .filter((oderDetail) => {
          return oderDetail.oder_id.toString() === oder_id
        })
        .forEach(async (item) => {
          await OdersDetailModel.updateOne(
            { _id: item._id },
            {
              $set: { status: statusNew },
            }
          )
        })
      res.status(200).json('update oder detail thành công')
    } catch (err) {
      res.status(500).json(err)
    }
  },
  updateAddress: async (req, res) => {
    try {
      const id = req.params.id
      await AddressModel.updateOne(
        { _id: id },
        {
          $set: { default: true },
        }
      )
      await AddressModel.updateMany(
        { _id: { $ne: id } },
        {
          $set: { default: false },
        }
      )

      return res.status(200).json({ message: 'update address successfully' })
    } catch (err) {
      return res.status(500).json(err)
    }
  },
}

module.exports = OderDetailController
