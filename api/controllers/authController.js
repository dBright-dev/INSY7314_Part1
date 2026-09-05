// src/utils/validators.js
class Validators {
    // Email validation
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password validation (min 8 chars, uppercase, lowercase, number)
    static validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    // Name validation (letters, spaces, hyphens, apostrophes)
    static validateName(name) {
        const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
        return nameRegex.test(name);
    }

    // Validate registration data
    static validateRegistration(data) {
        const errors = [];
        
        if (!data.email || !this.validateEmail(data.email)) {
            errors.push('Valid email is required');
        }
        
        if (!data.password || !this.validatePassword(data.password)) {
            errors.push('Password must be at least 8 characters with uppercase, lowercase, and numbers');
        }
        
        if (!data.firstName || !this.validateName(data.firstName)) {
            errors.push('First name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes');
        }
        
        if (!data.lastName || !this.validateName(data.lastName)) {
            errors.push('Last name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes');
        }
        
        if (data.role && !['freelancer', 'client'].includes(data.role)) {
            errors.push('Role must be either "freelancer" or "client"');
        }
        
        return errors;
    }

    // Validate login data
    static validateLogin(data) {
        const errors = [];
        
        if (!data.email || !this.validateEmail(data.email)) {
            errors.push('Valid email is required');
        }
        
        if (!data.password || typeof data.password !== 'string' || data.password.length < 1) {
            errors.push('Password is required');
        }
        
        return errors;
    }

    // Sanitize input (basic XSS protection)
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/[<>]/g, '');
    }

    // Sanitize user input object
    static sanitizeUserInput(data) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeInput(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
}

module.exports = Validators;