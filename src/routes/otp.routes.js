const express = require('express');
const router = express.Router();

const { generateOtp, verifyOtp } = require('../controllers/otp.controller');
const { otpGenerateLimiter, otpVerifyLimiter } = require('../middleware/rateLimiter');
const {
    validateGenerateOtp,
    validateVerifyOtp,
    handleValidationErrors,
} = require('../middleware/validate');

/**
 * @route   POST /api/v1/otp/generate
 * @desc    Generate and send OTP to the provided email
 * @access  Public
 *
 * Middleware pipeline:
 *  1. Rate limiter  — blocks abusive IPs
 *  2. Validators    — ensure email is present & valid
 *  3. Error check   — return 400 if validation fails
 *  4. Controller    — business logic
 */
router.post(
    '/generate',
    otpGenerateLimiter,
    validateGenerateOtp,
    handleValidationErrors,
    generateOtp
);

/**
 * @route   POST /api/v1/otp/verify
 * @desc    Verify the OTP submitted by the user
 * @access  Public
 *
 * Middleware pipeline:
 *  1. Rate limiter  — blocks brute-force attempts
 *  2. Validators    — ensure email + 6-digit OTP are present
 *  3. Error check   — return 400 if validation fails
 *  4. Controller    — business logic
 */
router.post(
    '/verify',
    otpVerifyLimiter,
    validateVerifyOtp,
    handleValidationErrors,
    verifyOtp
);

module.exports = router;
