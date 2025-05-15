// routes/listingImages.js
const express = require('express');
const createUpload = require('../utils/createUpload'); // Adjust path accordingly
const { ListingImage, Listing } = require('../models');
const router = express.Router();

// Create multer instance for 'listings' folder
const upload = createUpload('listings');

// Upload a single image file, form field name 'image'
router.post('/add', upload.single('image'), async (req, res) => {
  const { listing_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const listing = await Listing.findByPk(listing_id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Save relative path from your uploads folder
    const image_path = `/uploads/listings/${req.file.filename}`;

    const newImage = await ListingImage.create({
      listing_id,
      image_path,
    });

    res.status(201).json({
      message: 'Image added successfully',
      image: newImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding image', error: error.message });
  }
});


// Delete an image from a listing
router.delete('/delete/:image_id', async (req, res) => {
  const { image_id } = req.params;

  try {
    const image = await ListingImage.findByPk(image_id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await image.destroy();
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error });
  }
});

module.exports = router;
