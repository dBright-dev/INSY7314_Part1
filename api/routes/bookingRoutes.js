const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const transactionController = require('../controllers/transactionController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles('Client'),
    body('gig').isMongoId().withMessage('A valid gig ID is required'),
    bookingController.createBooking);
router.get('/my-bookings', authenticateToken, authorizeRoles('Client'), bookingController.getMyBookings);
router.get('/incoming', authenticateToken, authorizeRoles('Freelancer'), bookingController.getIncomingBookings);
router.get('/income', authenticateToken, authorizeRoles('Freelancer'), transactionController.getFreelancerIncome);

module.exports = router;
