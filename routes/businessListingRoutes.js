const express = require('express');
const router = express.Router();
const { BusinessListing } = require('../models');

// Create a new business listing
router.post('/businesslistings', async (req, res) => {
  try {
    const businessListing = await BusinessListing.create(req.body);
    res.status(201).json(businessListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all business listings
router.get('/businesslistings', async (req, res) => {
  try {
    const businessListings = await BusinessListing.findAll();
    res.status(200).json(businessListings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a business listing by ID
router.get('/businesslistings/:id', async (req, res) => {
  try {
    const businessListing = await BusinessListing.findByPk(req.params.id);
    if (!businessListing) {
      return res.status(404).json({ error: 'Business listing not found' });
    }
    res.status(200).json(businessListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a business listing
router.put('/businesslistings/:id', async (req, res) => {
  try {
    const businessListing = await BusinessListing.findByPk(req.params.id);
    if (!businessListing) {
      return res.status(404).json({ error: 'Business listing not found' });
    }
    await businessListing.update(req.body);
    res.status(200).json(businessListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a business listing
router.delete('/businesslistings/:id', async (req, res) => {
  try {
    const businessListing = await BusinessListing.findByPk(req.params.id);
    if (!businessListing) {
      return res.status(404).json({ error: 'Business listing not found' });
    }
    await businessListing.destroy();
    res.status(200).json({ message: 'Business listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
