/**
 * HustleHubt Backend Server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 */

// Parse JSON payloads
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Request logging 
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${req.ip}`);
        next();
    });
}

/**
 * Route Configuration
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'HustleHubt API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

/**
 * Centralized Error Handler - Must be last
 */
app.use(errorHandler);

/**
 * HTTPS Configuration
 * Using self-signed certificates for development
 */

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt'))
};

/**
 * Start HTTPS Server
 */
const server = https.createServer(httpsOptions, app);

server.listen(PORT, () => {
    console.log(`HustleHubt API running securely on https://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Documentation: https://localhost:${PORT}/api/health`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = { app, server };