const { RoleRequest, User } = require('../models');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const checkRole = require('../middleware/checkRole'); // Middleware to check user role 

router.post('/request-role', authenticate, async (req, res) => {
  const { requested_role, reason } = req.body;

  // Check if the requested role is valid
  const validRoles = ['employee']; // Add other roles here if needed
  if (!validRoles.includes(requested_role)) {
    return res.status(400).json({ error: 'Invalid role request' });
  }

  try {
    // Check if there is already a pending request for this user
    const existing = await RoleRequest.findOne({
      where: { user_id: req.user.id, status: 'pending' },
    });

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending request' });
    }

    // Create a new role request
    const request = await RoleRequest.create({
      user_id: req.user.id,
      requested_role,
      reason,
    });

    res.status(201).json({ message: 'Request submitted', request });
  } catch (error) {
    console.error('Error creating role request:', error);
    res.status(500).json({ error: 'Server error while submitting request' });
  }
});

router.get('/admin/role-requests', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const requests = await RoleRequest.findAll({ include: ['User'] });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching role requests:', error);
    res.status(500).json({ error: 'Server error while fetching role requests' });
  }
});

router.post('/admin/role-requests/:id/approve', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const request = await RoleRequest.findByPk(req.params.id);

    if (!request || request.status !== 'pending') {
      return res.status(404).json({ error: 'Request not found or already handled' });
    }

    // Update request status to 'approved'
    request.status = 'approved';
    await request.save();

    // Update user role
    const user = await User.findByPk(request.user_id);
    user.role = request.requested_role;
    await user.save();

    res.json({ message: 'Request approved and user upgraded', user });
  } catch (error) {
    console.error('Error approving role request:', error);
    res.status(500).json({ error: 'Server error while approving request' });
  }
});

router.post('/admin/role-requests/:id/reject', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const request = await RoleRequest.findByPk(req.params.id);

    if (!request || request.status !== 'pending') {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    // Reject the request
    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected successfully', request });
  } catch (error) {
    console.error('Error rejecting role request:', error);
    res.status(500).json({ error: 'Server error while rejecting request' });
  }
});

module.exports = router;