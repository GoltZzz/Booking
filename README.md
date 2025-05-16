# MJ Studios Photo Booth Booking System

A full-stack web application for booking photo booth services for events. This system allows users to browse packages, make bookings, and manage their reservations.

## Project Structure

The project is organized into two main parts:

- **Backend**: Express.js API server with MongoDB database
- **Frontend**: React application built with Vite

## Features

- User authentication and registration
- Browse photo booth packages
- Book a photo booth for an event
- View and manage bookings
- Admin dashboard for managing bookings and packages

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Mailgun for email notifications

### Frontend

- React
- React Router
- Axios
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd Booking
   ```

2. Install dependencies:

   ```
   npm install
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MAILGUN_API_KEY=your_mailgun_api_key
   MAILGUN_DOMAIN=your_mailgun_domain
   ```

4. Start the development server:

   ```
   npm run dev
   ```

   This will start both the backend server and the React development server concurrently.

## Development

- Backend API runs on `http://localhost:3000`
- Frontend development server runs on `http://localhost:5173`
- API requests from the frontend are proxied to the backend

## Deployment

For production deployment:

1. Build the frontend:

   ```
   npm run build
   ```

2. Set the NODE_ENV environment variable to 'production':

   ```
   NODE_ENV=production
   ```

3. Start the server:
   ```
   npm start
   ```

The Express server will serve the React frontend from the `client/dist` directory in production mode.

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `
