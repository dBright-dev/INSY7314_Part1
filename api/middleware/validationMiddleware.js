// src/middleware/validation.js
const Validators = require('../utils/validators');

class ValidationMiddleware {
    // Validate registration input
    static validateRegistration(req, res, next) {
        // Sanitize input first
        req.body = Validators.sanitizeUserInput(req.body);
        
        const errors = Validators.validateRegistration(req.body);
        
        if (errors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors
            });
        }
        
        next();
    }

    // Validate login input
    static validateLogin(req, res, next) {
        // Sanitize input first
        req.body = Validators.sanitizeUserInput(req.body);
        
        const errors = Validators.validateLogin(req.body);
        
        if (errors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors
            });
        }
        
        next();
    }
}

module.exports = ValidationMiddleware;