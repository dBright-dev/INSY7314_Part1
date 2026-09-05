/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validateRegistration, authController.register);

/**
 * POST /api/auth/login
 * Login an existing user
 */
router.post('/login', validateLogin, authController.login);

/**
 * GET /api/auth/profile
 * Get current user profile (Protected route)
 */
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;