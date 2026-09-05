const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {AuthorizationError, NotFoundError} = require('../middleware/errorHandler');

class UserController{
    //Get all users (Admin only)
    async getAllUsers(req, res, next) {
        try {
            const users = userModel.findAll();

            //Remove passwords from response
            const userWithoutPasswords = users.map(user =>{
                const { password, ...userWithoutPassword} = user;
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

    //Delete user (Admin only)
    async deleteUser(req, res, next){
        try{
            const{id} = req.params;
            
            //Prevent deleting yourself
            if (req.user.userId === id){
                return res.status(400).json({
                    sucess: false,
                    message: 'You cannot delete your own account through this endpoint'
                });
            }

            const deleted = userModel.deleteUser(id);

            if(!deleted) {
                return next(new NotFoundError('User not found'));
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch(error){
            next(error);
        }
    }
}

module.exports = new UserController();