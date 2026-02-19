const nodemailer = require('nodemailer');

/**
 * Create a transporter.
 * 
 * ⚠️ SECURITY WARNING: 
 * Hardcoded credentials are NOT recommended for production.
 * Ideally, use environment variables (process.env.SMTP_USER).
 * 
 * However, per user request, we are using:
 * User: devraj1502@gmail.com
 * Pass: lddazyxooxnbrxum
 */
const createTransporter = () => {
  // Use environment variables if available, otherwise fallback to hardcoded
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const user = process.env.SMTP_USER || 'devraj1502@gmail.com';
  const pass = process.env.SMTP_PASS || 'lddazyxooxnbrxum';

  return nodemailer.createTransport({
    host: host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for port 465, false for 587
    auth: {
      user: user,
      pass: pass,
    },
    // Increased timeout for slow connections
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
};

let transporter;
try {
  transporter = createTransporter();
} catch (e) {
  console.warn('⚠️  Could not create SMTP transporter. Defaulting to Mock Mode.');
  transporter = null;
}

/**
 * Send an OTP email to the specified address.
 */
const sendOtpEmail = async (to, otp) => {
  if (!transporter) {
    console.log('──────────────────────────────────────────────────────────');
    console.log(`📧 [MOCK EMAIL SERVICE] To: ${to}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log('⚠️  Transporter init failed. Check logs.');
    console.log('──────────────────────────────────────────────────────────');
    return { message: 'Mock email sent (check server logs)' };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"OTP Service" <devraj1502@gmail.com>',
    to,
    subject: 'Your One-Time Password (OTP)',
    text: `Your OTP is: ${otp}\n\nThis code expires in 60 seconds.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verification Code</h2>
        <h1 style="color: #4a90e2; letter-spacing: 5px;">${otp}</h1>
        <p>This code expires in 60 seconds.</p>
      </div>
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error.message}`);
    console.log('⚠️  Falling back to console log so you can still test:');
    console.log(`🔑 OTP for ${to}: ${otp}`);

    // Check for authentication error specifically
    if (error.message.includes('Username and Password not accepted')) {
      console.error('💡 TIP: Gmail blocks regular passwords by default.');
      console.error('   You likely need an "App Password" instead of your login password.');
      console.error('   Go to: https://myaccount.google.com/apppasswords');
    }

    return { message: 'Email failed, logged to console' };
  }
};

module.exports = { sendOtpEmail };
