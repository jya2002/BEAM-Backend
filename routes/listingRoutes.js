const express = require('express');
const router = express.Router();
const createUpload = require('../middleware/upload');
const listingController = require('../controllers/listingController');

// Upload middleware
const uploadMultiple = createUpload('listings').array('images', 5);
const uploadSingle = createUpload('listings').single('image');

// Routes
router.post('/listings', uploadMultiple, (req, res, next) => {
  console.log('FIELDS:', req.body);
  console.log('FILES:', req.files);
  next();
}, listingController.createListing);
router.get('/listings', listingController.getAllListings);
router.get('/listings/:id', listingController.getListingById);
router.put('/listings/:id', uploadSingle, listingController.updateListing);
router.delete('/listings/:id', listingController.deleteListing);

module.exports = router;
