const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    promoteToAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/promote-admin', promoteToAdmin); // For initial admin setup

// Protected routes
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
