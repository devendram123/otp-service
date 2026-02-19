const Otp = require('../models/otp.model');
const otpService = require('../services/otp.service');
const { sendOtpEmail } = require('../services/email.service');
const ApiError = require('../utils/ApiError');

/**
 * @route   POST /api/v1/otp/generate
 * @desc    Generate a cryptographically secure OTP, hash it, store it, and email it.
 * @access  Public
 */
const generateOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        // ── Step 1: Invalidate any existing OTPs for this email ──────────
        // Prevents OTP accumulation and ensures only the latest OTP is valid.
        await Otp.deleteMany({ email });

        // ── Step 2: Generate a crypto-secure 6-digit OTP ─────────────────
        const plainOtp = otpService.generate();

        // ── Step 3: Hash the OTP before storing in the database ──────────
        // The plaintext OTP is NEVER persisted — only the bcrypt hash is saved.
        const hashedOtp = await otpService.hash(plainOtp);

        // ── Step 4: Store the hashed OTP with email and auto-expiry ──────
        await Otp.create({
            email,
            otp: hashedOtp,
        });

        // ── Step 5: Send the plaintext OTP to the user's email ───────────
        await sendOtpEmail(email, plainOtp);

        // ── Step 6: Respond with success ─────────────────────────────────
        res.status(200).json({
            success: true,
            message: `OTP sent successfully to ${email}`,
            data: {
                expiresInSeconds: 60,
            },
        });
    } catch (error) {
        next(error); // Forward to central error handler
    }
};

/**
 * @route   POST /api/v1/otp/verify
 * @desc    Verify a user-submitted OTP against the stored hash.
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // ── Step 1: Find the most recent OTP record for this email ───────
        // If the TTL has expired, MongoDB has already deleted the document,
        // so a null result means the OTP has expired or was never generated.
        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

        if (!otpRecord) {
            throw new ApiError(401, 'OTP has expired or does not exist. Please request a new one.');
        }

        // ── Step 2: Check if this OTP was already used ───────────────────
        if (otpRecord.verified) {
            throw new ApiError(410, 'This OTP has already been used. Please request a new one.');
        }

        // ── Step 3: Compare the submitted OTP with the stored hash ───────
        const isMatch = await otpService.compare(otp, otpRecord.otp);

        if (!isMatch) {
            throw new ApiError(401, 'Invalid OTP. Please check and try again.');
        }

        // ── Step 4: Mark as verified to prevent reuse ────────────────────
        otpRecord.verified = true;
        await otpRecord.save();

        // ── Step 5: Respond with success ─────────────────────────────────
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { generateOtp, verifyOtp };
