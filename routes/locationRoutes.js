const express = require('express');
const router = express.Router();
const { Location } = require('../models');

// GET all locations (with optional pagination)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const locations = await Location.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.status(200).json({
      total: locations.count,
      pages: Math.ceil(locations.count / limit),
      data: locations.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching locations' });
  }
});

// GET a single location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the location' });
  }
});

// POST create a new location
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, address, sub_city, kebele, city, country } = req.body;

    if (!name || !sub_city || !kebele) {
      return res.status(400).json({ error: 'Missing required fields: name, sub_city, kebele' });
    }

    const newLocation = await Location.create({
      name,
      latitude,
      longitude,
      address,
      sub_city,
      kebele,
      city,
      country,
    });
    res.status(201).json(newLocation);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'An error occurred while creating the location' });
  }
});

// PUT update an existing location
router.put('/:id', async (req, res) => {
  try {
    const { name, latitude, longitude, address, sub_city, kebele, city, country } = req.body;
    const location = await Location.findByPk(req.params.id);

    if (location) {
      location.set({ name, latitude, longitude, address, sub_city, kebele, city, country });
      await location.save();
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the location' });
  }
});

// DELETE a location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (location) {
      await location.destroy();
      res.status(200).json({ message: 'Location deleted successfully' });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the location' });
  }
});

module.exports = router;
