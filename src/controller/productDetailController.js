const ProductDetailModel = require('../models/productDetailModel.js')
const ProductControllers = require('../models/productModel.js')

const DetailProductController = {
  getAllProductsDetail: async (req, res, next) => {
    try {
      const dretailProducts = await ProductDetailModel.find()
      res.status(200).json(dretailProducts)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  addProductDetail: async (req, res, next) => {
    try {
      const avtFiles = req.files
      console.log(avtFiles   );
      const id_product = req.body.id_product
      const nameImgDes = []
      avtFiles.forEach((img) => {
        nameImgDes.push(img.originalname)
      })
      const imgDesProduct = new ProductDetailModel({
        product_id: id_product,
        imgs: nameImgDes,
      })
      const resImg = await imgDesProduct.save()
      res
        .status(200)
        .json({ message: 'thêm hình ảnh chi tiết thành công', resImg })
    } catch (e) {
      res.status(500).json(e)
    }
  },
  editProductDetail: async (req, res, next) => {
    const product_id = req.params.id
    try {
      let imgs
      try {
        imgs = JSON.parse(req.body.files)
      } catch (error) {
        imgs = req.body.files
      }
      console.log(product_id, imgs)
      const ress = await ProductDetailModel.findOneAndUpdate(
        { product_id: product_id },
        { imgs: imgs },
        { new: true }
      )
      return res.json({ message: 'cập nhật ảnh chi tiết thành công', ress })
    } catch (e) {
      res.status(500).json(e)
    }
  },
  getAllProductsDetailById: async (req, res, next) => {
    const id_product = req.params.id
    try {
      const dretailProducts = await ProductDetailModel.findOne({
        product_id: id_product,
      })

      res.status(200).json(dretailProducts)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  deleteProductDetail : async (req, res, next) => {
    const product_id = req.params.id;
    try {
      const ress = await ProductDetailModel.findOneAndDelete({product_id: product_id},{new:true})
      return res.json({message:"xóa sản phẩm chi tiết thành công",ress})
    } catch (err) {
      return res.status(500).json(err)
    }
  },
}

module.exports = DetailProductController
