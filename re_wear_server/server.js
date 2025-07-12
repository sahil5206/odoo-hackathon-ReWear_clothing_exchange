const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join item browsing room
  socket.on('join-browse-room', () => {
    socket.join('browse-room');
    console.log('User joined browse room');
  });

  // Handle item updates
  socket.on('item-updated', (itemData) => {
    socket.to('browse-room').emit('item-updated', itemData);
  });

  // Handle new item added
  socket.on('item-added', (itemData) => {
    socket.to('browse-room').emit('item-added', itemData);
  });

  // Handle item deleted
  socket.on('item-deleted', (itemId) => {
    socket.to('browse-room').emit('item-deleted', itemId);
  });

  // Handle swap requests
  socket.on('swap-request', (swapData) => {
    socket.to(`user-${swapData.toUserId}`).emit('swap-request', swapData);
  });

  // Handle swap status updates
  socket.on('swap-status-updated', (swapData) => {
    socket.to(`user-${swapData.fromUserId}`).emit('swap-status-updated', swapData);
    socket.to(`user-${swapData.toUserId}`).emit('swap-status-updated', swapData);
  });

  // Handle user activity
  socket.on('user-activity', (activityData) => {
    socket.to('browse-room').emit('user-activity', activityData);
  });

  // Handle swap chat functionality
  socket.on('join-swap-chat', (chatData) => {
    socket.join(`swap-chat-${chatData.swapId}`);
    console.log(`User joined swap chat: ${chatData.swapId}`);
  });

  socket.on('leave-swap-chat', (swapId) => {
    socket.leave(`swap-chat-${swapId}`);
    console.log(`User left swap chat: ${swapId}`);
  });

  socket.on('swap-message', (messageData) => {
    socket.to(`swap-chat-${messageData.swapId}`).emit('swap-message', messageData);
  });

  socket.on('swap-typing', (typingData) => {
    socket.to(`swap-chat-${typingData.swapId}`).emit('swap-typing', typingData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ReWear API' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/items', require('./routes/items'));
app.use('/api/swaps', require('./routes/swaps'));
app.use('/api/points', require('./routes/points'));
app.use('/api', require('./routes/test'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for real-time connections`);
});

module.exports = app; 