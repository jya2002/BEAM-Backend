const express = require('express');
const upload = require('../middlewares/upload');
const router = express.Router();
const { Listing, ListingImage } = require('../models');
const path = require('path');
const fs = require('fs');

// 🔸 Create a listing
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      user_id,
      category_id,
      subcategory_id,
      location_id,
      status
    } = req.body;

    // Validate required fields
    if (!title_am || !title_en || !description_am || !description_en || !price || !user_id || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create listing
    const listing = await Listing.create({
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      user_id,
      category_id: category_id || null,
      subcategory_id: subcategory_id || null,
      location_id: location_id || null,
      status
    });

    // Handle images
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        listing_id: listing.listing_id,
        image_path: `/uploads/listings/${file.filename}`
      }));
      await ListingImage.bulkCreate(images);
    }

    res.status(201).json({ message: 'Listing created successfully', listing });

  } catch (error) {
    console.error('POST /listings error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 🔸 Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll({
      include: [ListingImage],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔸 Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [ListingImage]
    });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔸 Delete listing (and images)
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, { include: [ListingImage] });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    for (const img of listing.ListingImages || []) {
      const filePath = path.join(__dirname, '../', img.image_path);
      fs.unlink(filePath, err => {
        if (err && err.code !== 'ENOENT') console.error('Error deleting file:', err);
      });
    }

    await listing.destroy();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

