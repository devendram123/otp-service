const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const otpRoutes = require('./routes/otp.routes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Express Application Assembly
 *
 * Middleware order matters:
 *  1. helmet    — sets secure HTTP headers (X-Content-Type, HSTS, etc.)
 *  2. cors      — handles cross-origin requests
 *  3. morgan    — HTTP request logging (dev format for readability)
 *  4. json      — parses incoming JSON request bodies
 *  5. routes    — application route handlers
 *  6. 404       — catch-all for undefined routes
 *  7. error     — central error handler (must be last)
 */
const app = express();

// ── Trust Proxy (Required for Render/Heroku/AWS Load Balancers) ──────
// Fixes "ERR_ERL_UNEXPECTED_X_FORWARDED_FOR"
app.set('trust proxy', 1);

// ── Security Headers ─────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────
// In production, replace '*' with your frontend's actual origin(s).
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
}));

// ── Logging ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// ── Body Parser ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent abuse

// ── Health Check ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────
app.use('/api/v1/otp', otpRoutes);

// ── 404 Catch-All ────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ── Central Error Handler ────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
