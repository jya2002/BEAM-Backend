const express = require('express');
const router = express.Router();
const createUpload = require('../middleware/upload');
const listingController = require('../controllers/listingController');

// Create new multer upload handlers for each route
const uploadMultiple = createUpload('listings').array('images', 5);
const uploadSingle = createUpload('listings').single('image');

// Create listing with multiple images
router.post('/listings', uploadMultiple, listingController.createListing);

// Get all listings (optionally filtered)
router.get('/listings', listingController.getAllListings);

// Get listing by ID
router.get('/listings/:id', listingController.getListingById);

// Update a listing (optionally with a new image)
router.put('/listings/:id', uploadSingle, listingController.updateListing);

// Delete a listing and its images
router.delete('/listings/:id', listingController.deleteListing);

module.exports = router;
