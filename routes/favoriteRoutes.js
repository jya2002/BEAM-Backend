const express = require('express');
const router = express.Router();
const { Favorite } = require('../models');

// Add a listing to favorites
router.post('/favorites', async (req, res) => {
  try {
    const favorite = await Favorite.create(req.body);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorites of a user
router.get('/favorites/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.params.userId },
    });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a favorite
router.delete('/favorites/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    await favorite.destroy();
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
