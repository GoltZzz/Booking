# Photo Booth Booking System

A full-stack application for managing photo booth bookings for MJ Studios.

## Features

- User authentication (local and Google OAuth)
- Booking management
- Package selection
- Admin dashboard
- Email notifications

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Passport.js for authentication
- JWT for API authentication
- Express Session for web authentication

### Frontend

- React
- Vite
- Tailwind CSS

## Documentation

- [API Routes Documentation](ROUTES.md) - Details of all API endpoints
- [Improvement Suggestions](IMPROVEMENTS.md) - Suggestions for enhancing the codebase
- [Authentication System](AUTH_SYSTEM.md) - How sessions, cookies, and JWT work in the application

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB
- Google OAuth credentials (for Google Sign-In)

### Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/photo-booth-booking

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=24h

# Session
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173

# Email (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
EMAIL_FROM=no-reply@yourdomain.com
```

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/photo-booth-booking.git
cd photo-booth-booking
```

2. Install backend dependencies

```
npm install
```

3. Install frontend dependencies

```
cd client
npm install
cd ..
```

4. Start development servers

```
npm run dev
```

This will start both the backend server and the frontend development server concurrently.

### Google OAuth Setup

For Google Sign-In functionality, follow the instructions in [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md).

## Production Deployment

1. Build the frontend

```
npm run build
```

2. Set environment variables for production

```
NODE_ENV=production
```

3. Start the server

```
npm start
```

## License

This project is licensed under the MIT License.
