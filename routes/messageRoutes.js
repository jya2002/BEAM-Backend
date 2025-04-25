const express = require('express');
const router = express.Router();
const { Message } = require('../models');

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages for a user
router.get('/messages/:userId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { [Sequelize.Op.or]: [{ sender_id: req.params.userId }, { receiver_id: req.params.userId }] },
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark message as read
router.put('/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    await message.update({ is_read: true });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
