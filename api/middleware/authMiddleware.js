// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

class AuthMiddleware {
    // Verify JWT token
    static async authenticate(req, res, next) {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Authentication required. Please provide a valid token.'
                });
            }

            const token = authHeader.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret);
            
            // Attach user to request
            req.user = decoded;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token. Please login again.'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token expired. Please login again.'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Authentication failed.'
            });
        }
    }

    // Optional authentication (doesn't require token)
    static optionalAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, config.jwt.secret);
                req.user = decoded;
            }
            next();
        } catch (error) {
            // Continue without authentication
            next();
        }
    }
}

module.exports = AuthMiddleware;