const User = require('../models/user');

const userController = {
    // Get user profile
    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching profile', error: error.message });
        }
    },

    // Update user profile
    updateUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (user) {
                user.username = req.body.username || user.username;
                user.email = req.body.email || user.email;
                if (req.body.password) {
                    user.password = req.body.password;
                }
                const updatedUser = await user.save();
                res.json({
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    },

    // Admin Controllers
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}).select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                user.username = req.body.username || user.username;
                user.email = req.body.email || user.email;
                user.role = req.body.role || user.role;
                const updatedUser = await user.save();
                res.json({
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                await user.deleteOne();
                res.json({ message: 'User removed' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    }
};

module.exports = userController;