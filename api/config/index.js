// config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.warn(`⚠️  Warning: ${varName} is not set in environment variables`);
    }
});

module.exports = {
    // Server configuration
    server: {
        port: parseInt(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || 'development',
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production'
    },

    // SSL configuration
    ssl: {
        key: path.resolve(process.env.SSL_KEY_PATH || './ssl/key.pem'),
        cert: path.resolve(process.env.SSL_CERT_PATH || './ssl/cert.pem')
    },

    // JWT configuration (for future use)
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-this',
        expiresIn: process.env.JWT_EXPIRY || '7d'
    },

    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN ? 
            process.env.CORS_ORIGIN.split(',') : 
            ['http://localhost:3001', 'http://localhost:3000'],
        credentials: true
    },

    // Rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};