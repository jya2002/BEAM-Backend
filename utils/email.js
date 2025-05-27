const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey || !apiKey.startsWith('SG.')) {
  throw new Error('SENDGRID_API_KEY is missing or invalid. It must start with "SG."');
}

sgMail.setApiKey(apiKey);

/**
 * Send verification email
 * @param {string} toEmail - Recipient's email address
 * @param {string} token - Verification token
 */
const sendVerificationEmail = async (toEmail, token) => {
  try {
    const msg = {
      to: toEmail,
      from: 'julia.alemu@gmail.com',
      templateId: 'd-b524b402ce9d42fc9f48e7fd934c59f1',
      dynamic_template_data: {
        verificationUrl: `https://4cbf-16-16-79-137.ngrok-free.app/api/verify-email?token=${encodeURIComponent(token)}`,
      },
    };
    await sgMail.send(msg);
    console.log('✅ Verification email sent to', toEmail);
  } catch (error) {
    console.error('❌ Error sending verification email:', error.response?.body || error.message);
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
      from: 'julia.alemu@gmail.com', // Must match a verified sender in SendGrid
      templateId: 'd-995440ed121d42ddba22ada73f0b48a3',
      dynamic_template_data: {
        resetUrl: `http://localhost:3000/reset-password?token=${token}`,
      },
    };
    await sgMail.send(msg);
    console.log('✅ Password reset email sent to', toEmail);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.response?.body || error.message);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
