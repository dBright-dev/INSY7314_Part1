// server.js
const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import config
const config = require('./config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Import error handler
const ErrorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// ============================================
// 1. Basic Middleware
// ============================================

// Security headers (Helmet)
app.use(helmet());

// CORS
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials
}));

// Logging (Morgan)
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// 2. Request Logging (custom)
// ============================================

app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// ============================================
// 3. Health Check Endpoint
// ============================================

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.server.env,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// ============================================
// 4. API Routes
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ============================================
// 5. Error Handling
// ============================================

// 404 handler
app.use(ErrorHandler.notFound);

// Global error handler
app.use(ErrorHandler.errorHandler);

// ============================================
// 6. HTTPS Server Setup
// ============================================

// SSL configuration
let sslOptions;

try {
    const keyPath = path.resolve(config.ssl.key);
    const certPath = path.resolve(config.ssl.cert);
    
    // Check if SSL files exist
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.error('❌ SSL certificates not found!');
        console.error(`   Key path: ${keyPath}`);
        console.error(`   Cert path: ${certPath}`);
        console.error('   Please run: openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes');
        process.exit(1);
    }
    
    sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
        minVersion: 'TLSv1.2'
    };
} catch (error) {
    console.error('❌ Error loading SSL certificates:', error.message);
    process.exit(1);
}

// Create HTTPS server
const server = https.createServer(sslOptions, app);

// ============================================
// 7. Start Server
// ============================================

const PORT = config.server.port;

server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 HustleHub+ Backend Server');
    console.log('='.repeat(60));
    console.log(`🔒 HTTPS: https://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.server.env}`);
    console.log(`📅 Started: ${new Date().toISOString()}`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    console.log(`   GET    /health                  - Health check`);
    console.log(`   POST   /api/auth/register      - Register new user`);
    console.log(`   POST   /api/auth/login         - Login user`);
    console.log(`   GET    /api/auth/profile/:id?  - Get user profile`);
    console.log(`   GET    /api/users              - Get all users`);
    console.log(`   GET    /api/users/:id          - Get user by ID`);
    console.log(`   PUT    /api/users/:id          - Update user`);
    console.log(`   DELETE /api/users/:id          - Delete user`);
    console.log('='.repeat(60));
    console.log('\n💡 Test User Credentials:');
    console.log(`   Email: test@hustlehub.com`);
    console.log(`   Password: password123`);
    console.log('\n' + '='.repeat(60) + '\n');
});

// ============================================
// 8. Graceful Shutdown
// ============================================

const shutdown = (signal) => {
    console.log(`\n⚠️  ${signal} received: Shutting down gracefully...`);
    
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('❌ Force shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Unhandled exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
    shutdown('UNHANDLED_REJECTION');
});

module.exports = app;