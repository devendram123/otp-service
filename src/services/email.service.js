const nodemailer = require('nodemailer');

/**
 * Create a reusable Nodemailer SMTP transporter.
 * Configuration is pulled from environment variables.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send an OTP email to the specified address.
 *
 * @param {string} to  - Recipient email address
 * @param {string} otp - Plaintext OTP (shown to the user, NOT stored in DB)
 * @returns {Promise<object>} Nodemailer send result
 */
const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Your One-Time Password (OTP)',
        // Plain-text fallback
        text: `Your OTP is: ${otp}\n\nThis code expires in 60 seconds. Do not share it with anyone.`,
        // Professional HTML email
        html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fa; border-radius: 12px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Verification Code</h2>
        <p style="color: #555; font-size: 14px; margin-bottom: 24px;">
          Use the following OTP to complete your verification. This code is valid for <strong>60 seconds</strong>.
        </p>
        <div style="background: #1a1a2e; color: #fff; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 16px 24px; border-radius: 8px; margin-bottom: 24px;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
