const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
console.log('Setting up middleware...');
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = req.query[key].trim();
    }
  }
  next();
});

// Static files
console.log('Serving static files from /uploads...');
app.use('/uploads', express.static('uploads'));

// Route imports
console.log('Importing routes...');
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
const adminRoutes = require('./routes/adminRoutes');
const BusinessProfileRoutes = require('./routes/BusinessProfileRoutes');
const listingImagesRoutes = require('./routes/listingImagesRoutes');
const BusinessListingImagesRoutes = require('./routes/BusinessListingImagesRoutes');
const roleRequestsRoutes = require('./routes/roleRequestsRoutes');

// Use the routes
console.log('Registering routes...');
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
app.use('/api', adminRoutes);
app.use('/api', BusinessProfileRoutes);
app.use('/api', listingImagesRoutes);
app.use('/api', BusinessListingImagesRoutes);
app.use('/api', roleRequestsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('/health endpoint hit');
  res.status(200).json({ message: 'Server is healthy' });
});

// 404 Handler
app.use((req, res) => {
  console.warn('404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
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

// DB connection
console.log('Authenticating database connection...');
sequelize.authenticate()
  .then(() => console.log('✅ Database connection established'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

module.exports = app;
