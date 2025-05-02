// routes/listingImages.js
const express = require('express');
const { ListingImage, Listing } = require('../models');
const router = express.Router();

// Add a new image to a listing
router.post('/add', async (req, res) => {
  const { listing_id, image_path } = req.body;

  try {
    const listing = await Listing.findByPk(listing_id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const newImage = await ListingImage.create({
      listing_id,
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
