/**
 * References: 
 * Manico & Detlefsen, 2015 - Chapter 4: Authentication
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

class AuthController {
   
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Check if user already exists - return 400 Bad Request as specified
            const existingUser = userModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered. Please use a different email address or login.'
                });
            }

            // Hash password using bcrypt with 10 salt rounds
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user with hashed password
            const user = userModel.createUser({
                name,
                email,
                password: hashedPassword,
                role: role || 'Client'
            });

            // Return user data without password
            const { password: _, ...userWithoutPassword } = user;

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: userWithoutPassword
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed. Please try again.'
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = userModel.findByEmail(email);
            
            // Return 401 Unauthorized if user not found
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password using bcrypt.compare
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token on successful login
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            // Return user data without password
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
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed. Please try again.'
            });
        }
    }

    /**
     * Get current user profile - Protected route
     */
    async getProfile(req, res) {
        try {
            // req.user is set by authMiddleware
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
            console.error('Profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile'
            });
        }
    }
}

module.exports = new AuthController();
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
);

return res.status(200).json({
  message: 'Login successful',
  token,
  user: { id: user.id, name: user.name, role: user.role } // never send the password hash back
});

