const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { user_id, type, title, content } = req.body;
    const notification = await Notification.create({ user_id, type, title, content });
    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notifications by user ID
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.params.userId },
      order: [['sent_at', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark a notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { notification_id: req.params.id } }
    );
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    await Notification.destroy({
      where: { notification_id: req.params.id },
    });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
