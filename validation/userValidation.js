const { body } = require('express-validator');

const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
];

module.exports = { validateRegistration };
