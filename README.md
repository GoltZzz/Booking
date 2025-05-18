# Booking System

A full-stack booking system with user and admin interfaces, built with React, Express, MongoDB, and Mailgun for email notifications.

## Features

### User Booking Flow

- Simple booking form with event type, date, and special request fields
- Email confirmation when booking is submitted
- User dashboard showing all bookings with status

### Admin Features

- View all bookings with filtering options
- Confirm pending bookings with a single click
- Email notifications to users when booking is confirmed

### Email Notifications

- User receives email when booking is submitted
- Admin receives email when new booking is created
- User receives email when booking is confirmed

## Technical Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT + Session-based authentication
- **Email Service**: Mailgun

## Setup Instructions

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/booking-system

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
TOKEN_EXPIRY=1d

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
```

### Installation

1. **Install backend dependencies**

   ```
   npm install
   ```

2. **Install frontend dependencies**

   ```
   cd client
   npm install
   ```

3. **Start the development server**
   ```
   npm run dev
   ```

### API Endpoints

#### Booking Endpoints

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get a specific booking by ID
- `GET /api/bookings/all` - Get all bookings (admin only)
- `PUT /api/bookings/:id/confirm` - Confirm a booking (admin only)
- `PUT /api/bookings/:id/status` - Update booking status (admin only)

## Implementation Details

### Backend

- Mongoose model for bookings (eventType, eventDate, specialRequest)
- Controller functions for creating, retrieving, and updating bookings
- Email service integration with Mailgun for notifications
- Authentication middleware for protecting routes

### Frontend

- User booking form component with validation
- User booking list component for the dashboard
- Admin booking management with confirmation functionality
- Toast notifications for success/error feedback

## Mailgun Setup

1. Sign up for a Mailgun account
2. Add your domain or use the sandbox domain for testing
3. Get your API key from the Mailgun dashboard
4. Add these to your .env file
