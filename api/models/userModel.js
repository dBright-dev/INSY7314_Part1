// src/models/userModel.js
const bcrypt = require('bcryptjs');
const config = require('../config');

class UserModel {
    constructor() {
        // In-memory storage - This will be replaced with a database later
        this.users = [];
        this.currentId = 1;
        
        // Seed with test user
        this.seedTestUser();
    }

    async seedTestUser() {
        // Add test user for development
        const testUser = {
            id: this.currentId++,
            email: config.testUser.email,
            password: await bcrypt.hash(config.testUser.password, config.security.bcryptSaltRounds),
            firstName: 'Test',
            lastName: 'User',
            role: 'client',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.users.push(testUser);
        console.log('✅ Test user created:', config.testUser.email);
    }

    // Create a new user
    async create(userData) {
        try {
            // Hash password
            const saltRounds = config.security.bcryptSaltRounds;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            
            const newUser = {
                id: this.currentId++,
                ...userData,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.users.push(newUser);
            
            // Remove password from returned user
            const { password, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Find user by email
    async findByEmail(email) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
        );
    }

    // Find user by ID
    async findById(id) {
        const user = this.users.find(user => user.id === id);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    // Validate password
    async validatePassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return false;
        
        return await bcrypt.compare(password, user.password);
    }

    // Get all users (for debugging)
    getAllUsers() {
        return this.users.map(({ password, ...user }) => user);
    }

    // Clear all users (for testing)
    clearUsers() {
        this.users = [];
        this.currentId = 1;
        this.seedTestUser();
    }
}

// Export singleton instance
module.exports = new UserModel();