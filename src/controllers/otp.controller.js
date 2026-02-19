const Otp = require('../models/otp.model');
const otpService = require('../services/otp.service');
const { sendOtpEmail } = require('../services/email.service');
const ApiError = require('../utils/ApiError');

// ── In-Memory Store (Fallback when no DB) ────────────────────────────
const memoryStore = new Map();

/**
 * @route   POST /api/v1/otp/generate
 * @desc    Generate a cryptographically secure OTP, hash it, store it, and email it.
 * @access  Public
 */
const generateOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const plainOtp = otpService.generate();
        const hashedOtp = await otpService.hash(plainOtp);
        const useCustomDb = !!process.env.MONGODB_URI;

        if (useCustomDb) {
            // ── MongoDB Mode ─────────────────────────────────────────────
            await Otp.deleteMany({ email });
            await Otp.create({ email, otp: hashedOtp });
        } else {
            // ── In-Memory Mode ───────────────────────────────────────────
            // Overwrite existing entry for this email
            memoryStore.set(email, {
                otp: hashedOtp,
                verified: false,
                expiresAt: Date.now() + 60 * 1000 // 60 seconds from now
            });
        }

        // ── Send Email ───────────────────────────────────────────────────
        await sendOtpEmail(email, plainOtp);

        res.status(200).json({
            success: true,
            message: `OTP sent successfully to ${email}`,
            data: { expiresInSeconds: 60 },
        });
    } catch (error) {
        next(error);
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
        const useCustomDb = !!process.env.MONGODB_URI;
        let otpRecord;

        if (useCustomDb) {
            // ── MongoDB Mode ─────────────────────────────────────────────
            otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

            if (!otpRecord) {
                throw new ApiError(401, 'OTP has expired or does not exist. Please request a new one.');
            }
        } else {
            // ── In-Memory Mode ───────────────────────────────────────────
            const record = memoryStore.get(email);
            if (!record) {
                throw new ApiError(401, 'OTP has expired or does not exist. Please request a new one.');
            }

            // Check manual expiry
            if (Date.now() > record.expiresAt) {
                memoryStore.delete(email); // Cleanup
                throw new ApiError(401, 'OTP has expired. Please request a new one.');
            }

            // Map the simple object to look like the Mongoose doc structure
            otpRecord = record;
        }

        // ── Common Verification Logic ────────────────────────────────────
        if (otpRecord.verified) {
            throw new ApiError(410, 'This OTP has already been used. Please request a new one.');
        }

        const isMatch = await otpService.compare(otp, otpRecord.otp);

        if (!isMatch) {
            throw new ApiError(401, 'Invalid OTP. Please check and try again.');
        }

        // Mark as verified
        otpRecord.verified = true;
        if (useCustomDb) {
            await otpRecord.save();
        } else {
            // Update the map entry
            memoryStore.set(email, otpRecord);
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { generateOtp, verifyOtp };
