const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const connectdb = require('./db/config')
const cookieParser = require('cookie-parser')
const path = require('path')
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Load environment variables
dotenv.config()


// Create the Express app
const app = express()


// Create an HTTP server
const server = http.createServer(app)

// Create a Socket.IO server
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://shop-blue-theta.vercel.app',
      'https://shop-vh.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Middleware setup
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://shop-blue-theta.vercel.app',
      'https://shop-vh.vercel.app'
    ],
  })
)
app.use(cookieParser())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static('public'))

// Connect to the database
connectdb()

// Init routes
const authRoutes = require('./router/auth')
const brandRounters = require('./router/brand')
const addressRounters = require('./router/address')
const productRounters = require('./router/product')
const discountCodeRounters = require('./router/discountCode')
const productDiscountRounters = require('./router/productDiscount')
const bankRounters = require('./router/bank')
const oderRounters = require('./router/oder')
const oderDetailRounters = require('./router/oderDetail')
const mailRounters = require('./router/mail')
const commentsRounters = require('./router/comment')
const sellerRounters = require('./router/seller')


app.use((req, res, next) => {
  req.io = io
  next()
})


io.on('connection', (socket) => {

  // Khi người dùng tham gia vào phòng
  socket.on('join', ({ id, name }) => {
    socket.join(id);
    console.log(`Number of users in room ${id}`);
  });
});


app.use('/v1/auth', authRoutes)
app.use('/v1/auth/mail', mailRounters)
app.use('/v1/brand', brandRounters)
app.use('/v1/address', addressRounters)
app.use('/v1/product', productRounters)
app.use('/v1/discountCode', discountCodeRounters)
app.use('/v1/productDiscount', productDiscountRounters)
app.use('/', bankRounters)
app.use('/v1/oder', oderRounters)
app.use('/v1/oderDetail', oderDetailRounters)
app.use('/v1/comment', commentsRounters)
app.use('/v1/seller', sellerRounters)

app.post('/callback', async (req, res) => {

  console.log('callback: ');
  console.log(req.body);

  return res.status(204).json(req.body);
});




// Start the server
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

