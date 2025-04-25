const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send verification email
 * @param {string} toEmail - Recipient's email address
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (toEmail, token) => {
  try {
    const msg = {
      to: toEmail,
      from: 'julia.alemu@gmail.com', // Your verified sender email
      templateId: 'd-b524b402ce9d42fc9f48e7fd934c59f1', // SendGrid template ID for verification
      dynamic_template_data: {
        verificationUrl: `http://localhost:3000/api/verify-email?token=${token}`, // Replace with your frontend URL
      },
    };
    await sgMail.send(msg);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error.response?.body || error.message);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} toEmail - Recipient's email address
 * @param {string} token - Password reset token
 */
const sendPasswordResetEmail = async (toEmail, token) => {
  try {
    const msg = {
      to: toEmail,
      from: 'julia.alemu@gmail.com', // Your verified sender email
      templateId: 'd-995440ed121d42ddba22ada73f0b48a3', // SendGrid template ID for password reset
      dynamic_template_data: {
        resetUrl: `http://localhost:3000/reset-password?token=${token}`, // Replace with your frontend URL
      },
    };
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error.response?.body || error.message);
    throw error;
  }
};

// Export both functions
module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
