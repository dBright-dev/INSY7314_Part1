/**
 * References: Manico & Detlefsen, 2015 - Chapter 4: Authentication
 */

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');

class UserModel {
    
    constructor() {
        this.users = [];
        this.loadUsers();
    }

    loadUsers() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf8');
                this.users = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = [];
        }
    }

    saveUsers() {
        try {
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.users, null, 2));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    createUser(userData) {
        const user = {
            id: uuidv4(),
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: userData.password, // Will be hashed in controller
            role: userData.role || 'Client',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    findByEmail(email) {
        return this.users.find(user => user.email === email.toLowerCase());
    }

    findById(id) {
        return this.users.find(user => user.id === id);
    }

    findAll() {
        return this.users;
    }

    updateUser(id, updateData) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;

        this.users[index] = {
            ...this.users[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        this.saveUsers();
        return this.users[index];
    }

    // ✅ Delete user (NEW)
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return false;

        this.users.splice(index, 1);
        this.saveUsers();
        return true;
    }
}

module.exports = new UserModel();