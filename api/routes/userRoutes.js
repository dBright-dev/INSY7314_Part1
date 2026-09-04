// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ userId: req.user.userId, role: req.user.role});
});

module.exports = router;