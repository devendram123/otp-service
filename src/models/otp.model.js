const mongoose = require('mongoose');

/**
 * OTP Schema
 *
 * Security notes:
 * - `otp` field stores a bcrypt hash — never the plaintext OTP.
 * - `createdAt` has an `expires` TTL of 60 seconds.
 *   MongoDB's background thread automatically deletes the document
 *   once 60 seconds have elapsed since `createdAt`, guaranteeing
 *   that expired OTPs cannot be verified even if app logic fails.
 * - `verified` flag prevents OTP reuse after successful verification.
 */
const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            index: true, // Fast lookups by email
        },
        otp: {
            type: String,
            required: [true, 'OTP hash is required'],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60, // TTL index — document auto-deleted after 60 seconds
        },
    },
    {
        timestamps: false, // We manage createdAt manually for the TTL index
    }
);

module.exports = mongoose.model('Otp', otpSchema);
