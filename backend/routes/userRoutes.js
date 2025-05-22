const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user profile
router.get('/profile', authMiddleware.protect, userController.getUserProfile);

// Update user profile
router.put('/profile', authMiddleware.protect, userController.updateUserProfile);

// Admin routes
router.get('/', authMiddleware.protect, authMiddleware.admin, userController.getAllUsers);
router.get('/:id', authMiddleware.protect, authMiddleware.admin, userController.getUserById);
router.put('/:id', authMiddleware.protect, authMiddleware.admin, userController.updateUser);
router.delete('/:id', authMiddleware.protect, authMiddleware.admin, userController.deleteUser);

module.exports = router;