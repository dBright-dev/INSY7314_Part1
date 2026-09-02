
class UserModel {
    constructor() {
        // In-memory storage
        this.users = [];
        this.currentId = 1;
        
        // Seed with test user for development
        this.seedTestUser();
    }

    seedTestUser() {
        // Add test user (password will be hashed in authController)
        this.users.push({
            id: this.currentId++,
            email: 'test@hustlehub.com',
            password: '$2a$10$H7zPZqKxY5XxY5XxY5XxYO4XxY5XxY5XxY5XxY5XxY5XxY5XxY5', // "password123"
            firstName: 'Test',
            lastName: 'User',
            role: 'client',
            createdAt: new Date().toISOString()
        });
    }

    /**
     * Find user by email
     */
    findByEmail(email) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
        );
    }

    /**
     * Find user by ID
     */
    findById(id) {
        return this.users.find(user => user.id === id);
    }

    /**
     * Create new user
     */
    create(userData) {
        const newUser = {
            id: this.currentId++,
            ...userData,
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        return newUser;
    }

    /**
     * Get all users (for admin purposes)
     */
    findAll() {
        return this.users;
    }

    /**
     * Update user
     */
    update(id, updateData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;
        
        this.users[index] = {
            ...this.users[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        return this.users[index];
    }

    /**
     * Delete user
     */
    delete(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return false;
        
        this.users.splice(index, 1);
        return true;
    }
}

module.exports = new UserModel();