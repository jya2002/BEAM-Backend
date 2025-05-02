// routes/businessListingImages.js
const express = require('express');
const { BusinessListingImage, BusinessListing } = require('../models');
const router = express.Router();

// Add a new image to a business listing
router.post('/add', async (req, res) => {
  const { business_listing_id, image_path } = req.body;

  try {
    const businessListing = await BusinessListing.findByPk(business_listing_id);
    if (!businessListing) {
      return res.status(404).json({ message: 'Business listing not found' });
    }

    const newImage = await BusinessListingImage.create({
      business_listing_id,
      image_path,
    });

    res.status(201).json({
      message: 'Image added successfully',
      image: newImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding image', error });
  }
});

// Delete an image from a business listing
router.delete('/delete/:image_id', async (req, res) => {
  const { image_id } = req.params;

  try {
    const image = await BusinessListingImage.findByPk(image_id);
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
