const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { User } = require('../models'); // Sequelize User model
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();

// --- Utilities ---
const hashPassword = async (password) => bcrypt.hash(password, 10);
const validatePassword = async (password, hash) => bcrypt.compare(password, hash);
const normalizePhone = (phone) => phone.replace(/\D/g, '').slice(-9); // Only last 9 digits

// --- Rate Limiting ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again later.',
});

// --- Middleware: Authenticate Token ---
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization header missing or invalid' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- POST /register ---
router.post('/register', async (req, res) => {
  const { full_name, email, password, phone_number } = req.body;

  if (!full_name || !email || !password || !phone_number) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone_number);

  if (!/^\d{9}$/.test(normalizedPhone)) {
    return res.status(400).json({ error: 'Phone number must be exactly 9 digits.' });
  }

  try {
    const [existingUser, existingPhone] = await Promise.all([
      User.findOne({ where: { email: normalizedEmail } }),
      User.findOne({ where: { phone_number: normalizedPhone } }),
    ]);

    if (existingUser) return res.status(409).json({ error: 'User with this email already exists.' });
    if (existingPhone) return res.status(409).json({ error: 'User with this phone number already exists.' });

    const user = await User.create({
      full_name,
      email: normalizedEmail,
      password, // hashed by Sequelize hook
      phone_number: normalizedPhone,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    await sendVerificationEmail(user.email, token);

    return res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Something went wrong during registration.' });
  }
});

// --- GET /verify-email ---
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token is required.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [updated] = await User.update({ is_verified: true }, { where: { id: decoded.id } });

    if (!updated) return res.status(400).json({ error: 'Invalid verification attempt.' });
    return res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Email Verification Error:', err.message);
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
});

// --- POST /login ---
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user || !(await validatePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_verified) return res.status(403).json({ error: 'Email not verified.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.json({ token });
  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// --- POST /forgot-password ---
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    await sendPasswordResetEmail(user.email, resetToken);

    return res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    return res.status(500).json({ error: 'Unable to send reset email.' });
  }
});

// --- POST /reset-password ---
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required.' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await hashPassword(newPassword);
    await User.update({ password: hashed }, { where: { id } });

    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
});

// --- GET /user (Authenticated) ---
router.get('/user', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.status(200).json(user);
  } catch (err) {
    console.error('Get User Error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve user.' });
  }
});

// --- DELETE /user (Authenticated) ---
router.delete('/user', authenticate, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.id !== req.userId) return res.status(403).json({ error: 'Unauthorized to delete this account.' });

    await user.destroy(); // Soft delete if enabled in model
    return res.json({ message: `User with email ${email} deleted.` });
  } catch (err) {
    console.error('Delete User Error:', err.message);
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
