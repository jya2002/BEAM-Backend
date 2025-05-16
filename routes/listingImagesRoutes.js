const express = require('express');
const fs = require('fs');
const path = require('path');
const createUpload = require('../middleware/upload');
const { Listing, ListingImage } = require('../models');

const router = express.Router();
const upload = createUpload('listings');

// Helper to build full image URL
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/listings/${filename}`;
};

// ----------------------------------------------------
// Upload a single image for a listing
// ----------------------------------------------------
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

    const image_path = `/uploads/listings/${req.file.filename}`;
    const newImage = await ListingImage.create({ listing_id, image_path });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        ...newImage.toJSON(),
        full_url: getImageUrl(req, req.file.filename),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// ----------------------------------------------------
// Upload multiple images for a listing
// ----------------------------------------------------
router.post('/add-multiple', upload.array('images', 5), async (req, res) => {
  const { listing_id } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image files uploaded' });
  }

  try {
    const listing = await Listing.findByPk(listing_id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const images = await Promise.all(
      req.files.map(file =>
        ListingImage.create({
          listing_id,
          image_path: `/uploads/listings/${file.filename}`,
        })
      )
    );

    res.status(201).json({
      message: 'Images uploaded successfully',
      images: images.map((img, i) => ({
        ...img.toJSON(),
        full_url: getImageUrl(req, req.files[i].filename),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

// ----------------------------------------------------
// Delete an image by ID
// ----------------------------------------------------
router.delete('/delete/:image_id', async (req, res) => {
  const { image_id } = req.params;

  try {
    const image = await ListingImage.findByPk(image_id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const filePath = path.join(__dirname, '..', image.image_path);
    fs.unlink(filePath, async (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ message: 'Error deleting image file', error: err.message });
      }

      await image.destroy();
      res.status(200).json({ message: 'Image deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

module.exports = router;


