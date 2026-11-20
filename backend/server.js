require('dotenv').config();
if (!process.env.JWT_SECRET) {
  console.error('CRITICAL CONFIGURATION ERROR: JWT_SECRET is not defined in your environment/env file.');
  process.exit(1);
}

const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB Database
connectDB();

// Create HTTP server instance
const server = http.createServer(app);

// Mount Socket.io on the server
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Configure Socket.io listener
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Customer joins specific tracking room based on Order ID
  socket.on('joinOrderTrack', ({ orderId }) => {
    socket.join(orderId);
    console.log(`Socket joined order tracking room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Expose Socket.io instance to the application requests
app.set('io', io);

// Handle uncaught node exceptions
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
