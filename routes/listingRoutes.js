const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Listing } = require('../models');
const createUpload = require('../middleware/upload');
const upload = createUpload('listings'); 


router.post('/listings', upload.single('image'), async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    console.log('Uploaded file info:', req.file);

    const {
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      user_id,
      category_id,
      location_id,
      status,
    } = req.body;

    // Validate required fields
    if (!title_am || !title_en || !description_am || !description_en || !price || !user_id || !status) {
      return res.status(400).json({
        error: 'Missing required fields: title_am, title_en, description_am, description_en, price, user_id, or status',
      });
    }

    const image_path = req.file ? `/uploads/listings/${req.file.filename}` : null;

    const listing = await Listing.create({
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      user_id,
      category_id: category_id || null,
      location_id: location_id || null,
      status,
      image_path,
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error('Create Listing Error:', err);
    console.error('Request Body:', req.body);
    console.error('Uploaded File:', req.file);

    if (err.name === 'SequelizeValidationError') {
      console.error('Validation Details:', err.errors);
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors.map((e) => e.message),
      });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get all listings
router.get('/listings', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = categoryId ? { category_id: categoryId } : {};
    const listings = await Listing.findAll({ where: whereClause });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a listing by ID
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (err) {
    console.error('Get Listing by ID Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a listing
router.put('/listings/:id', upload.single('image'), async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const {
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      status,
    } = req.body;

    const image_path = req.file ? `/uploads/listings/${req.file.filename}` : listing.image_path;

    await listing.update({
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      status,
      image_path,
    });

    res.status(200).json(listing);
  } catch (err) {
    console.error('Update Listing Error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: err.message });
  }
});


// Delete a listing
router.delete('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    await listing.destroy();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Delete Listing Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
