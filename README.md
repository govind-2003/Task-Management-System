# Task Management System

A full-stack task management application built with MERN stack (MongoDB, Express.js, React, Node.js) that allows users to create, manage, and track tasks with file attachment capabilities.

![Dashboard](./pictures/Admin Dashboard.png)

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access (Admin/User)
  - JWT token authentication
  
  ![Auth](./pictures/auth.png)

- **Task Management**
  - Create, read, update, and delete tasks
  - Set priority levels (High, Medium, Low)
  - Track task status (Pending, In-Progress, Completed)
  - File attachments (PDF support, up to 3 files)
  - Due date assignment
  
  ![Task Creation](./pictures/task-creation.png)

- **Admin Features**
  - User management
  - Task assignment to different users
  - View all tasks across users
  
  ![Admin Dashboard](./pictures/admin-dashboard.png)

- **User Features**
  - Personal task dashboard
  - Task filtering and sorting
  - PDF file attachments
  
  ![Task Details](./pictures/task-details.png)

## Technology Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Storage**: Local storage
- **Authentication**: JWT
- **Containerization**: Docker

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)
- Git

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

2. Create `.env` file in root directory:
```properties
# Backend Configuration
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
VITE_TOKEN_KEY=task_management_token
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Manual Installation

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your values

3. Start the application:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

## Project Structure

```
task-management-system/
├── backend/                # Backend server code
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── uploads/          # File storage
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── styles/       # CSS styles
│   └── public/           # Static files
├── pictures/             # Project screenshots
└── docker-compose.yml    # Docker configuration
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- TailwindCSS for the UI components
- MongoDB Atlas for database hosting
- Vercel for deployment platform

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/task-management-system](https://github.com/yourusername/task-management-system)