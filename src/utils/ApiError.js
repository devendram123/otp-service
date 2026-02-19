/**
 * Custom API Error class.
 * Extends the native Error to carry an HTTP status code,
 * making it easy for the central error handler to set the response status.
 */
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes expected errors from programming bugs
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
