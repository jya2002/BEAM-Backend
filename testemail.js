require('dotenv').config();
const { sendVerificationEmail, sendPasswordResetEmail } = require('./utils/email');//Adjust path if needed

const testEmail = async () => {
  const testRecipient = 'yourtestemail@example.com'; // Use a real email you have access to
  const fakeToken = '12345testtoken67890';

  try {
    // Choose one to test
    await sendVerificationEmail(testRecipient, fakeToken);
    // await sendPasswordResetEmail(testRecipient, fakeToken);

    console.log('✅ Test email sent. Check your inbox.');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
};

testEmail();
