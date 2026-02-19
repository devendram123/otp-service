const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for OTP generation endpoint.
 * Allows at most 5 generate requests per IP every 15 minutes.
 * Prevents spamming the email service and brute-force OTP harvesting.
 */
const otpGenerateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 5,                    // 5 requests per window per IP
    standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,      // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again after 15 minutes.',
    },
});

/**
 * Rate limiter for OTP verification endpoint.
 * Allows at most 5 verify attempts per IP every 15 minutes.
 * Prevents brute-force guessing of 6-digit OTPs (1M combinations).
 */
const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many verification attempts. Please try again after 15 minutes.',
    },
});

module.exports = { otpGenerateLimiter, otpVerifyLimiter };
