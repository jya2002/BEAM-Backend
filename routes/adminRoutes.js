const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // JWT authentication middleware
const checkRole = require('../middleware/checkRole'); // Role-checking middleware

// Models
const { User } = require('../models');

// Admin Dashboard Route
router.get('/dashboard', authenticate, checkRole('admin'), async (req, res) => {
  try {
    // Fetch some dashboard data - can be customized based on your requirements
    const totalUsers = await User.count(); // Total number of users
    const totalAdmins = await User.count({ where: { role: 'admin' } }); // Number of admins
    const totalSellers = await User.count({ where: { role: 'seller' } }); // Number of sellers
    const totalBuyers = await User.count({ where: { role: 'buyer' } }); // Number of buyers

    // This can be expanded to show more detailed data (like recent user sign-ups, etc.)
    res.json({
      message: 'Welcome to the Admin Dashboard',
      totalUsers,
      totalAdmins,
      totalSellers,
      totalBuyers,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// View All Users (Admin Only)
router.get('/users', authenticate, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update User Role (Admin Only)
router.put('/users/:id/role', authenticate, checkRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // 'admin', 'employee', 'seller', 'buyer'
  
  if (!['admin', 'employee', 'seller', 'buyer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Delete User (Admin Only)
router.delete('/users/:id', authenticate, checkRole('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
