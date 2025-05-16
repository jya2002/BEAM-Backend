const express = require('express');
const router = express.Router();
const createUpload = require('../middleware/upload');
const listingController = require('../controllers/listingController');

const upload = createUpload('listings');

// Create listing with images
router.post('/listings', upload.array('images', 5), listingController.createListing);

// Get all listings (optionally filtered by categoryId)
router.get('/listings', listingController.getAllListings);

// Get single listing by ID
router.get('/listings/:id', listingController.getListingById);

// Update a listing (optionally with a new image)
router.put('/listings/:id', upload.single('image'), listingController.updateListing);

// Delete a listing and its images
router.delete('/listings/:id', listingController.deleteListing);

module.exports = router;
