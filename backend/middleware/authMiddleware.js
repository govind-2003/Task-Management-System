const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = {
    // Verify JWT token
    protect: async (req, res, next) => {
        try {
            // Get token from header
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Not authorized, no token' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    },

    // Check if user is admin
    admin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as admin' });
        }
    }
};

module.exports = authMiddleware;