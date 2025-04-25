const express = require('express');
const router = express.Router();
const { Payment } = require('../models');

// Create a new payment
router.post('/payments', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all payments for a transaction
router.get('/payments/:transactionId', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { transaction_id: req.params.transactionId },
    });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
