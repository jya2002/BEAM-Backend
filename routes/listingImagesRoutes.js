const express = require('express');
const fs = require('fs');
const path = require('path');
const { Listing, ListingImage } = require('../models');
const createUpload = require('../middleware/upload');
const multer = require('multer');
const router = express.Router();
const uploadSingle = createUpload('listings').single('image');
const uploadMultiple = createUpload('listings').array('images', 5);

// Helper
const getImageUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/listings/${filename}`;

// Upload Single Image
router.post('/add', uploadSingle, async (req, res) => {
  const { listing_id } = req.body;
  if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

  try {
    const listing = await Listing.findByPk(listing_id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const image = await ListingImage.create({
      listing_id,
      image_path: `/uploads/listings/${req.file.filename}`,
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        ...image.toJSON(),
        full_url: getImageUrl(req, req.file.filename),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Upload Multiple Images
router.post('/add-multiple', uploadMultiple, async (req, res) => {
  const { listing_id } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No image files uploaded' });

  try {
    const listing = await Listing.findByPk(listing_id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const images = await Promise.all(req.files.map(file =>
      ListingImage.create({
        listing_id,
        image_path: `/uploads/listings/${file.filename}`,
      })
    ));

    res.status(201).json({
      message: 'Images uploaded successfully',
      images: images.map((img, i) => ({
        ...img.toJSON(),
        full_url: getImageUrl(req, req.files[i].filename),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading images', error: err.message });
  }
});

// Delete image by ID
router.delete('/delete/:image_id', async (req, res) => {
  const { image_id } = req.params;
  try {
    const image = await ListingImage.findByPk(image_id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const imagePath = path.join(__dirname, '..', image.image_path.replace(/^\/+/, ''));
    fs.unlink(imagePath, async (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ message: 'Error deleting image file', error: err.message });
      }
      await image.destroy();
      res.status(200).json({ message: 'Image deleted successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting image', error: err.message });
  }
});

module.exports = router;
