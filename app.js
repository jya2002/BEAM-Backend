const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

//===========================
// Middleware
//===========================
console.log('🔧 Setting up middleware...');
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Trim whitespace from query params
app.use((req, res, next) => {
  Object.keys(req.query).forEach(key => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = req.query[key].trim();
    }
  });
  next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Serving static files from /uploads');

//===========================
// Route Imports
//===========================
console.log('📦 Importing routes...');
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

//===========================
// Register Routes
//===========================
console.log('🚀 Registering routes...');
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
app.use('/api/Images', listingImagesRoutes); // image upload routes
app.use('/api', BusinessListingImagesRoutes);
app.use('/api', roleRequestsRoutes);

//===========================
// Health Check
//===========================
app.get('/health', (req, res) => {
  console.log('🔍 /health endpoint hit');
  res.status(200).json({ message: 'Server is healthy' });
});

app.get('/', (req, res) => {
  res.send('🚦 Beam backend is running!');
});

//===========================
// 404 Handler
//===========================
app.use((req, res) => {
  console.warn('⚠️ 404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

//===========================
// Error Handler
//===========================
app.use((err, req, res, next) => {
  console.error('❌ Error encountered:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token has expired' });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected field in file upload', field: err.field });
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

//===========================
// Database Connection
//===========================
console.log('🔌 Authenticating database connection...');
sequelize.authenticate()
  .then(() => console.log('✅ Database connection established'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

//===========================
// Export App
//===========================
module.exports = app;
