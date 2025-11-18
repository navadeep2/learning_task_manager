 // server/middleware/errorMiddleware.js
 
const errorMiddleware = (err, req, res, next) => {
    // Determine the status code. If the error has a status property, use it; otherwise, default to 500 (Internal Server Error).
    const statusCode = err.status || 500;
    
    // Determine the error message. Use the custom message if available, otherwise a generic error.
    const message = err.message || 'An unexpected error occurred.';

    // Log the error for debugging purposes (optional, but highly recommended)
    console.error(`Status: ${statusCode}, Path: ${req.originalUrl}, Error: ${message}`, err.stack);

    // Send the standardized JSON response
    res.status(statusCode).json({
        success: false, // Explicitly set to false for all error responses
        message: message,
        // In a production environment, you might omit err.stack for security.
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorMiddleware;