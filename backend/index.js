const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome route - add this before your other routes
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Task Management System API</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 50px;
                        background: #f0f2f5;
                    }
                    .container {
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #4f46e5;
                        margin-bottom: 20px;
                    }
                    .status {
                        color: #10b981;
                        font-size: 1.2em;
                        margin: 20px 0;
                    }
                    .details {
                        color: #6b7280;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Task Management System API</h1>
                    <div class="status">✨ Backend Server is Running!</div>
                    <div class="details">
                        <p>Environment: ${process.env.NODE_ENV}</p>
                        <p>Port: ${PORT}</p>
                        <p>Server Time: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Simple file not found handler for uploads
app.get('/uploads/:filename', (req, res, next) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }
    res.sendFile(filePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;