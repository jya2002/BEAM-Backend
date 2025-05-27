const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { Listing, ListingImage } = require('../models');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/listings'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ============================
// CREATE Listing with Images
// ============================
router.post('/listings', upload.array('images', 10), async (req, res) => {
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

    // Save image paths if files are uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        listing_id: listing.listing_id,
        image_path: `/uploads/listings/${file.filename}`,
      }));

      await ListingImage.bulkCreate(images);
    }

    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (err) {
    console.error('Create Listing Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


