/**
 * References:
 * - Manico & Detlefsen, 2015 - Chapter 5: Session Management
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Extract Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required. Please login to continue.'
        });
    }

    try {
        // Verify token using JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data to request object
        req.user = decoded;
        
        next();
    } catch (error) {
        // Handle different JWT verification errors
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }

        // Generic error for other JWT issues
        return res.status(403).json({
            success: false,
            message: 'Authentication failed. Please login again.'
        });
    }
};

/**
 * Middleware to authorize specific roles
 * Implements Role-Based Access Control (RBAC)
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions. Access denied.'
            });
        }

        next();
    };
};

/**
 * Check if user is authenticated (doesn't require token)
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Token is invalid - continue without user
            req.user = null;
        }
    }

    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    optionalAuth
};