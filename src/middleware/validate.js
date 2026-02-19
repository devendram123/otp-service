const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validation rules for the OTP generate endpoint.
 * - `email` must be present, must be a valid email format, and is normalized.
 */
const validateGenerateOtp = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
];

/**
 * Validation rules for the OTP verify endpoint.
 * - `email` must be present and valid.
 * - `otp` must be exactly 6 digits.
 */
const validateVerifyOtp = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
        .isNumeric().withMessage('OTP must contain only digits'),
];

/**
 * Middleware that checks validation results.
 * If any rule failed, returns a 400 response with the first error message.
 * Otherwise, passes control to the next handler.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return the first validation error for a clean UX
        const firstError = errors.array()[0].msg;
        throw new ApiError(400, firstError);
    }
    next();
};

module.exports = { validateGenerateOtp, validateVerifyOtp, handleValidationErrors };
