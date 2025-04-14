# Internship Application Reminder System

A comprehensive web application designed to help students and professionals track internship opportunities, manage application deadlines, and receive personalized recommendations.

## Features

- User authentication and profile management
- Personalized internship recommendations using machine learning
- Smart notification system for application deadlines
- Interactive calendar for deadline tracking
- Comprehensive internship opportunities database
- Mobile-responsive design

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: Firebase
- Authentication: JWT
- Machine Learning: TensorFlow.js for recommendations
- UI Framework: Material-UI

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add necessary environment variables (see .env.example)

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
└── server/               # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   └── utils/        # Utility functions
    └── config/          # Configuration files
``` 
