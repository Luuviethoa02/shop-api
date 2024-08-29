const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const connectdb = require('./db/config')
const cookieParser = require('cookie-parser')
const path = require('path')

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
      'https://shopvh.netlify.app',
      'https://shop-blue-theta.vercel.app',
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
      'https://shopvh.netlify.app',
      'https://shop-blue-theta.vercel.app',
    ],
  })
)
app.use(cookieParser())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static('public'))

// Connect to the database
connectdb()

// Init routes
const authRoutes = require('./router/auth')
const sizeRounters = require('./router/size')
const colorRounters = require('./router/color')
const brandRounters = require('./router/brand')
const addressRounters = require('./router/address')
const productRounters = require('./router/product')
const discountCodeRounters = require('./router/discountCode')
const productDiscountRounters = require('./router/productDiscount')
const bankRounters = require('./router/bank')
const oderRounters = require('./router/oder')
const oderDetailRounters = require('./router/oderDetail')
const shipperRounters = require('./router/shipper')
const cancelRounters = require('./router/cancel')
const completeRounters = require('./router/complete')
const shippingRounters = require('./router/shipping')
const mailRounters = require('./router/mail')
const commentsRounters = require('./router/comment')

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // Khi người dùng tham gia vào phòng
  socket.on('join', ({id,name}) => {
    socket.join(id)
    const room = io.sockets.adapter.rooms.get(id);
    
    // Kiểm tra số lượng người trong phòng
    const numClients = room ? room.size : 0;
    console.log(`Number of users in room ${id}: ${numClients}`);
  })

  // Khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })

  socket.on('reconnect', () => {
    console.log('User reconnected:', socket.id);
  });
})

app.use((req, res, next) => {
  req.io = io
  next()
})

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
app.use('/v1/shipping', shippingRounters)
app.use('/v1/shipper', shipperRounters)
app.use('/v1/cancel', cancelRounters)
app.use('/v1/complete', completeRounters)
app.use('/v1/comment', commentsRounters)

// Start the server
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

module.exports = { io }
