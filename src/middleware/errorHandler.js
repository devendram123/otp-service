const ApiError = require('../utils/ApiError');

/**
 * Central error-handling middleware.
 *
 * Express identifies this as an error handler because it has 4 parameters.
 * All errors (thrown or passed via next(err)) funnel through here.
 *
 * In development: returns the full stack trace for debugging.
 * In production:  returns only the message — no internal details leak.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code was set
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`❌ [${statusCode}] ${message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Include stack trace only in development for debugging
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
