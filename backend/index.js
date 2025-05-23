const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Define PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Allow all origins in development

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Welcome route
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
                        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT} in the ${process.env.NODE_ENV} Environment Mode`);
        });
    })
    .catch((err) => {
        console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;