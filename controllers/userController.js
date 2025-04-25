'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models'); // Your Sequelize User model
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Rate limiter for brute force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts. Please try again later.',
});

// Utility: Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Joi validation schema for registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone_number: Joi.string().required(),
});

// **1. Register User**
const registerUser = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: value.email } });
    if (existingUser) {
      return res.status(409).send({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(value.password);

    // Create user
    const user = await User.create({
      name: value.name,
      email: value.email,
      password: hashedPassword,
      phone_number: value.phone_number,
      is_verified: false, // Initially not verified
    });

    // Generate verification token and send email
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(value.email, token);

    res.status(201).send({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Something went wrong' });
  }
};

// **2. Verify Email**
const verifyEmail = async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).send({ error: 'User not found' });

    user.is_verified = true;
    await user.save();

    res.send({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: 'Invalid or expired token.' });
  }
};

// **3. Login User**
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).send({ error: 'Invalid email or password.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ error: 'Invalid email or password.' });

    if (!user.is_verified) return res.status(403).send({ error: 'Email not verified.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Something went wrong.' });
  }
};

// **4. Forgot Password**
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send({ error: 'User not found.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    await sendPasswordResetEmail(email, token);

    res.send({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Something went wrong.' });
  }
};

// **5. Reset Password**
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).send({ error: 'User not found.' });

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.send({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: 'Invalid or expired token.' });
  }
};

// Export functions
module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  authLimiter,
};
