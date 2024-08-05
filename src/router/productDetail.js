const express = require('express')
const DetailProductController = require('../controller/productDetailController.js')

const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./src/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
})
  
const upload = multer({ storage: storage });

router.get('/',DetailProductController.getAllProductsDetail)

router.get('/detail/:id',DetailProductController.getAllProductsDetailById)

router.post('/add',upload.array('imgs'),DetailProductController.addProductDetail)

const checkUploadCondition = (req, res, next) => {
  const nameImgDes = [];  
  if (req.files && req.files.length > 0) {
       req.files.forEach(img=>{
        nameImgDes.push(img.originalname);
    })
    req.body.files = nameImgDes
  }
  next();
};

router.put('/edit/:id',upload.array('files'),checkUploadCondition,DetailProductController.editProductDetail)

router.delete('/delete/:id',DetailProductController.deleteProductDetail)

module.exports = router



module.exports = router
