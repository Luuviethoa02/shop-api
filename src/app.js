const multer = require('multer')
const express = require('express')
const app = express()
const cloudinary = require('cloudinary').v2;
const cors = require('cors')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const connectdb = require('./db/config')
const authRoutes = require('./router/auth')
const sizeRounters = require('./router/size')
const colorRounters = require('./router/color')
const brandRounters = require('./router/brand')
const addressRounters = require('./router/address')
const productRounters = require('./router/product')
const discountCodeRounters = require('./router/discountCode')
const productDiscountRounters = require('./router/productDiscount')
const bankRounters = require('./router/bank')
const mailRounters = require('./router/mail')

const oderRounters = require('./router/oder')
const oderDetailRounters = require('./router/oderDetail')
const reasonRounters = require('./router/reason')
const shipperRounters = require('./router/shipper')
const cancelRounters = require('./router/cancel')
const completeRounters = require('./router/complete')
const shippingRounters = require('./router/shipping')

const path = require('path')
const cookieParser = require('cookie-parser')
// Đặt thư mục chứa các tệp tin ảnh của bạn làm thư mục tĩnh
app.use(express.static(path.join(__dirname, 'uploads')))

//dot env
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://shopvh.netlify.app'],
  })
)

//connect db config
connectdb()

const port = process.env.PORT || 3000

//file public
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ejs
app.set('view engine', 'ejs')
app.set('views', 'src/views')

//cookie parser
app.use(cookieParser())

//body-parser
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// init routes
app.use('/v1/auth', authRoutes)
app.use('/v1/auth/mail', mailRounters)
app.use('/v1/size', sizeRounters)
app.use('/v1/color', colorRounters)
app.use('/v1/brand', brandRounters)
app.use('/v1/address', addressRounters)
app.use('/v1/product', productRounters)
app.use('/v1/discountCode', discountCodeRounters)
app.use('/v1/productDiscount', productDiscountRounters)
app.use('/v1/bank', bankRounters)

app.use('/v1/oder', oderRounters)
app.use('/v1/oderDetail', oderDetailRounters)
app.use('/v1/reason', reasonRounters)
app.use('/v1/shipping', shippingRounters)
app.use('/v1/shipper', shipperRounters)
app.use('/v1/cancel', cancelRounters)
app.use('/v1/complete', completeRounters)

// app.use('/v1/img' , express.static(path.join(__dirname, 'uploads')))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
