// src/config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'JWT_SECRET',
    'SSL_KEY_PATH',
    'SSL_CERT_PATH'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`❌ Environment variable ${varName} is required`);
        process.exit(1);
    }
});

// Validate JWT secret strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters long');
}

module.exports = {
    // Server configuration
    server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || 'localhost',
        env: process.env.NODE_ENV || 'development',
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development'
    },

    // SSL configuration
    ssl: {
        key: path.resolve(process.env.SSL_KEY_PATH),
        cert: path.resolve(process.env.SSL_CERT_PATH)
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRY || '7d',
        algorithm: 'HS256'
    },

    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN ? 
            process.env.CORS_ORIGIN.split(',') : 
            ['http://localhost:3001', 'http://localhost:3000'],
        credentials: true,
        optionsSuccessStatus: 200
    },

    // Security
    security: {
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    },

    // Test user (for development)
    testUser: {
        email: process.env.TEST_USER_EMAIL || 'test@hustlehub.com',
        password: process.env.TEST_USER_PASSWORD || 'password123'
    }
};