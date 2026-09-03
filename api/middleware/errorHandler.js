/**
 * References:
 * - Manico & Detlefsen, 2015 - Chapter 8: Error Handling
 */

const errorHandler = (err, req, res, next) => {
    // Log error internally 
    console.error('Error occurred:', {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        ip: req.ip,
        error: err.message,
        stack: err.stack // Only for logging
    });

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Controlled error response 
    const response = {
        success: false,
        message: getSafeErrorMessage(err, statusCode)
    };

    if (process.env.NODE_ENV === 'development' && err.validationErrors) {
        response.errors = err.validationErrors;
    }
    res.status(statusCode).json(response);
};

/**
 * Get safe error message based on status code and environment
 */
const getSafeErrorMessage = (err, statusCode) => {
    // Safe error messages for common scenarios
    const safeMessages = {
        400: 'Invalid request. Please check your input.',
        401: 'Authentication required. Please login.',
        403: 'Access denied. Insufficient permissions.',
        404: 'Resource not found.',
        409: 'Resource conflict. The requested operation cannot be completed.',
        500: 'Something went wrong. Please try again later.'
    };

    // In development, provide more detail (but still safe)
    if (process.env.NODE_ENV === 'development') {
        return err.message || safeMessages[statusCode] || 'An error occurred';
    }

    // In production, only return safe generic messages
    return safeMessages[statusCode] || 'An unexpected error occurred. Please try again.';
};

/**
 * Custom error class for validation errors
 */
class ValidationError extends Error {
    constructor(message, validationErrors = []) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.validationErrors = validationErrors;
    }
}

/**
 * Custom error class for authentication errors
 */
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

/**
 * Custom error class for authorization errors
 */
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.statusCode = 403;
    }
}

/**
 * Custom error class for not found errors
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

module.exports = {
    errorHandler,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError
};