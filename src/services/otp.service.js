const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * OTP Service
 * Handles cryptographically secure OTP generation and hashing.
 */
const otpService = {
    /**
     * Generate a 6-digit OTP using Node's built-in crypto module.
     * `crypto.randomInt()` is cryptographically strong — suitable for security tokens.
     *
     * @returns {string} 6-digit OTP as a string (preserves leading zeros)
     */
    generate() {
        return crypto.randomInt(100000, 999999).toString();
    },

    /**
     * Hash an OTP using bcrypt before storing it in the database.
     * Salt rounds = 10 — a good balance between speed and brute-force resistance.
     *
     * @param {string} otp - Plaintext OTP
     * @returns {Promise<string>} Bcrypt hash
     */
    async hash(otp) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(otp, salt);
    },

    /**
     * Compare a plaintext OTP against its bcrypt hash.
     *
     * @param {string} plainOtp  - User-submitted OTP
     * @param {string} hashedOtp - Stored bcrypt hash
     * @returns {Promise<boolean>} True if they match
     */
    async compare(plainOtp, hashedOtp) {
        return bcrypt.compare(plainOtp, hashedOtp);
    },
};

module.exports = otpService;
