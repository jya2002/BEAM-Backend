const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded requests

// Logging and sanitization middleware
app.use((req, res, next) => {
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = req.query[key].trim();
    }
  }
  next();
});

// Serve static files (e.g., uploads)
app.use('/uploads', express.static('uploads'));

// Route imports
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/SubcategoryRoutes');
const businessListingRoutes = require('./routes/businessListingRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const locationRoutes = require('./routes/locationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Use the routes
app.use('/api', userRoutes);
app.use('/api', listingRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api', businessListingRoutes);
app.use('/api', favoriteRoutes);
app.use('/api', messageRoutes);
app.use('/api', paymentRoutes);
app.use('/api', transactionRoutes);
app.use('/api', reviewRoutes);
app.use('/api', locationRoutes);
app.use('/api', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ message: 'Server is healthy' }));

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error encountered:', err);
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token has expired' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

// Sync the database
sequelize.sync()
  .then(() => console.log('Database synced!'))
  .catch(err => console.error('Error syncing database:', err));

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    sequelize.close(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    sequelize.close(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});
