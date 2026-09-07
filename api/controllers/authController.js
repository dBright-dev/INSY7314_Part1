/**
 * References: Manico & Detlefsen, 2015 - Chapter 4: Authentication
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { AuthenticationError, NotFoundError } = require('../middleware/errorHandler');

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = userModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered. Please use a different email address or login.'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = userModel.createUser({
                name,
                email,
                password: hashedPassword,
                role: role || 'Client'
            });

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = userModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = userModel.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                data: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
