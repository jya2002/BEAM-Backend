const express = require('express');
const router = express.Router();
const { BusinessProfile, User } = require('../models');
const checkBusinessRole = require('../middleware/checkBusinessRole');
// Create a new business profile
router.post('/', async (req, res) => {
  try {
    const profile = await BusinessProfile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a business profile by user_id
router.get('/user/:userId', async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ where: { user_id: req.params.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update business profile
router.put('/:businessId', checkBusinessRole, async (req, res) => {
    try {
      const profile = await BusinessProfile.findByPk(req.params.businessId);
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
  
      await profile.update(req.body);
      res.json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

// Delete business profile
router.delete('/:businessId', async (req, res) => {
  try {
    const profile = await BusinessProfile.findByPk(req.params.businessId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    await profile.destroy();
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
