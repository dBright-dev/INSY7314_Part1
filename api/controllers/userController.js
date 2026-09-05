const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {AuthorizationError, NotFoundError} = require('../middleware/errorHandler');

class UserController{
/**
 * References: Manico & Detlefsen, 2015 - Chapter 6: Access Control
 */

    /**
     * Get all users (Admin only)
     */
    async getAllUsers(req, res) {
        try {
            const users = userModel.findAll();
            
            // Remove passwords from response
            const usersWithoutPasswords = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.status(200).json({
                success: true,
                data: userWithoutPasswords
            });
        } catch (error){
            next(error);
        }
    }

    //Get user by ID
    async getUserById(req, res, next){
        try {
            const{id} = req.params;

            //Check if user is requesting their own data or is admin
            if(req.user.userId !== id && req.user.role !== 'Admin') {
                return next(new AuthorizationError('Access denied. You can only view your own profile.'));
            }

            const user = userModel.findById(id);

            if(!user){
                return next(new NotFoundError('User not found'));
            }

            const {password, ...userWithoutPassword} = user;

            res.status(200).json({
                success: true,
                data:userWithoutPassword
            });
        } catch(error){
            next(error);
        }
    }

    //Update user
    async updateUser(req, res, next){
        try {
            const{id} = req.params;
            const updateData = req.body;

            //Check if user is updating their own data or is admin
            if(req.user.userId !== id && req.user.role !== 'Admin'){
                return next(new AuthorizationError('Access denied. You can only update your own profile.'));
            }

            //If password is being updated, hash it
            if(updateData.password){
                data: usersWithoutPasswords
            }
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            
            // Check if user is requesting their own data or is admin
            if (req.user.userId !== id && req.user.role !== 'Admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only view your own profile.'
                });
            }

            const user = userModel.findById(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const { password, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                data: userWithoutPassword
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user'
            });
        }
    }

    /**
     * Update user
     */
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Check if user is updating their own data or is admin
            if (req.user.userId !== id && req.user.role !== 'Admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only update your own profile.'
                });
            }

            // If password is being updated, hash it
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedUser = userModel.updateUser(id, updateData);

            if(!updatedUser){
                return next(new NotFoundError('User not found'));
            }

            const {password, ...userWithoutPassword} = updatedUser;

            res.status(200).json({
                success: true,
                message: 'User profile updated sucessfully',
                data: userWithoutPassword
            });
        } catch(error){
            next(error);
        }
    }

    /**
     * Delete user (Admin only)
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Prevent deleting yourself
            if (req.user.userId === id) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot delete your own account through this endpoint'
                });
            }

            const deleted = userModel.deleteUser(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
    }
}

module.exports = new UserController();