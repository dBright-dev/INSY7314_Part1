// config/index.js
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = {
    server: {
        port: parseInt(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || 'development',
        isDev: process.env.NODE_ENV === 'development'
    },
    ssl: {
        key: path.resolve(process.env.SSL_KEY_PATH || './ssl/key.pem'),
        cert: path.resolve(process.env.SSL_CERT_PATH || './ssl/cert.pem')
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-me',
        expiresIn: process.env.JWT_EXPIRY || '7d'
    },
    cors: {
        origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : ['http://localhost:3001']
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    }
};