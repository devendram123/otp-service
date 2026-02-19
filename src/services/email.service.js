const nodemailer = require('nodemailer');

/**
 * Create a transporter.
 * If credentials are missing or look like default placeholders, return null (Mock Mode).
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || '';
  const user = process.env.SMTP_USER || '';

  // Detection for missing or placeholder config
  if (!host || host === 'smtp.gmail.com' && user === 'your-email@gmail.com') {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Shorter timeout to prevent hanging requests
    connectionTimeout: 5000,
    socketTimeout: 5000,
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
  // ── MOCK MODE (Console Log) ─────────────────────────────────────────
  if (!transporter) {
    console.log('──────────────────────────────────────────────────────────');
    console.log(`📧 [MOCK EMAIL SERVICE] To: ${to}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log('──────────────────────────────────────────────────────────');
    // Return success to allow API to proceed
    return { message: 'Mock email sent (check server logs)' };
  }

  // ── REAL MODE (SMTP) ────────────────────────────────────────────────
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"OTP Service" <no-reply@dev.com>',
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
    // ── FALLBACK ON ERROR ─────────────────────────────────────────────
    console.error(`❌ Email sending failed: ${error.message}`);
    console.log('⚠️  Falling back to console log so you can still test:');
    console.log(`🔑 OTP for ${to}: ${otp}`);

    // Return success anyway so frontend doesn't crash 
    // (In production you might want to throw, but for this demo it's better to work)
    return { message: 'Email failed, logged to console' };
  }
};

module.exports = { sendOtpEmail };
