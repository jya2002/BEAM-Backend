const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');

// Create a new transaction
router.post('/transactions', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all transactions for a user
router.get('/transactions/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Sequelize.Op.or]: [{ buyer_id: req.params.userId }, { seller_id: req.params.userId }],
      },
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update transaction status
router.put('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    await transaction.update(req.body);
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
