/**
 * Server Entry Point
 *
 * 1. Loads environment variables from .env
 * 2. Connects to MongoDB
 * 3. Starts the Express HTTP server
 *
 * Graceful shutdown is handled via SIGTERM to close the DB connection cleanly.
 */
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB and start listening ───────────────────────────
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        console.log(`📋 Health check: http://localhost:${PORT}/health`);
        console.log(`📮 OTP Generate:  POST http://localhost:${PORT}/api/v1/otp/generate`);
        console.log(`✅ OTP Verify:    POST http://localhost:${PORT}/api/v1/otp/verify`);
    });

    // ── Graceful Shutdown ────────────────────────────────────────────────
    process.on('SIGTERM', () => {
        console.log('🛑 SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('💤 Server closed.');
            process.exit(0);
        });
    });
});
