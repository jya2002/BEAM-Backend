const express = require('express');
const router = express.Router();
const { Review } = require('../models');

// Add a review
router.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reviews for a user
router.get('/reviews/:userId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { [Sequelize.Op.or]: [{ reviewer_id: req.params.userId }, { reviewee_id: req.params.userId }] },
    });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
