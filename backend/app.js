const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ErrorHandler = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Security and middleware parsing
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Throttling for authentication attempts (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API Server is running smoothly' });
});

// Route mountings
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Catch 404 (Resource not found)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Resource not found: ${req.originalUrl}` });
});

// Global error handler middleware
app.use(ErrorHandler);

module.exports = app;
