const multer = require('multer');
const express = require('express');
const router = express.Router();
const createUpload = require('../middleware/upload');
const listingController = require('../controllers/listingController');

// Upload middleware
const uploadMultiple = createUpload('listings').array('images', 5);
const uploadSingle = createUpload('listings').single('image');

// Routes
router.post('/listings', (req, res, next) => {
  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Multer passed:', req.files);
    next();
  });
}, listingController.createListing);

router.get('/listings', listingController.getAllListings);
router.get('/listings/:id', listingController.getListingById);
router.put('/listings/:id', uploadSingle, listingController.updateListing);
router.delete('/listings/:id', listingController.deleteListing);

module.exports = router;
