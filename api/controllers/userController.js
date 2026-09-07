// controllers/userController.js
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { AuthorizationError, NotFoundError } = require('../middleware/errorHandler');

class UserController {
    // ✅ Get all users (Admin only)
    async getAllUsers(req, res, next) {
        try {
            const users = userModel.findAll();
            const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
            res.status(200).json({
                success: true,
                data: usersWithoutPasswords
            });
        } catch (error) {
            next(error); // now next is defined
        }
    }

    // ✅ Get user by ID (own or admin)
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            // Check permission: user can view own profile or admin
            if (req.user.userId !== id && req.user.role !== 'Admin') {
                return next(new AuthorizationError('Access denied. You can only view your own profile.'));
            }

            const user = userModel.findById(id);
            if (!user) {
                return next(new NotFoundError('User not found'));
            }

            const { password, ...userWithoutPassword } = user;
            res.status(200).json({
                success: true,
                data: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    // ✅ Update user (own or admin)
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (req.user.userId !== id && req.user.role !== 'Admin') {
                return next(new AuthorizationError('Access denied. You can only update your own profile.'));
            }

            // If password provided, hash it
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedUser = userModel.updateUser(id, updateData);
            if (!updatedUser) {
                return next(new NotFoundError('User not found'));
            }

            const { password, ...userWithoutPassword } = updatedUser;
            res.status(200).json({
                success: true,
                message: 'User profile updated successfully',
                data: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    // ✅ Delete user (Admin only)
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            // Prevent admin from deleting themselves
            if (req.user.userId === id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot delete your own account through this endpoint.'
                });
            }

            const deleted = userModel.deleteUser(id);
            if (!deleted) {
                return next(new NotFoundError('User not found'));
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();