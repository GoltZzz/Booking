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

## Prerequisites

Before setting up this project, make sure you have the following installed:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **Git**

## Detailed Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd Booking

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. MongoDB Atlas Setup

1. **Create a MongoDB Atlas account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account or log in

2. **Create a new cluster**

   - Click "Build a Database"
   - Choose the free tier option
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set up database access**

   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Create a username and password (save these for your .env file)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Set up network access**

   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development) or add your specific IP
   - Click "Confirm"

5. **Get your connection string**
   - Once your cluster is created, click "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with your preferred database name (e.g., "booking-system")

### 3. Mailgun Setup

1. **Create a Mailgun account**

   - Go to [Mailgun](https://www.mailgun.com/)
   - Sign up for a free account

2. **Verify your domain or use sandbox domain**

   - For testing, you can use the provided sandbox domain
   - For production, add and verify your own domain

3. **Get your API key**
   - Go to API Keys in your Mailgun dashboard
   - Copy your Private API key

### 4. Google OAuth Setup (Optional - for Google Login)

1. **Create a Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

2. **Configure OAuth consent screen**

   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" and configure the basic information

3. **Create OAuth credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
   - Copy your client ID and client secret for your .env file

### 5. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/booking-system?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=generate_a_secure_random_string_here
SESSION_SECRET=another_secure_random_string_here
TOKEN_EXPIRY=1d

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
MAILGUN_FROM_EMAIL=noreply@yourdomain.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

For generating secure random strings for JWT_SECRET and SESSION_SECRET, run in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Running the Application

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately
npm run server    # Start backend only
npm run client    # Start frontend only
```

- Backend will run on: http://localhost:3000
- Frontend will run on: http://localhost:5173

### 7. Building for Production

```bash
# Build the React frontend
npm run build

# Start the production server
npm start
```

## Troubleshooting

### MongoDB Connection Issues

- Check your IP is whitelisted in Network Access
- Verify username and password are correct
- Ensure the connection string format is correct

### Mailgun Issues

- Verify API key is correct
- For sandbox domains, recipient emails must be verified
- Check Mailgun dashboard for sending logs

### JWT Authentication Issues

- Ensure JWT_SECRET is set correctly
- Check that TOKEN_EXPIRY is in a valid format

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile (authenticated)

### Booking Endpoints

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
