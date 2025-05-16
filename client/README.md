# MJ Studios Photo Booth Booking - Frontend

This is the frontend React application for the MJ Studios Photo Booth Booking system. It allows users to book photo booth services for various events.

## Features

- User authentication (login/register)
- Browse available photo booth packages
- Book a photo booth for an event
- View and manage bookings
- Responsive design for all devices

## Tech Stack

- React
- React Router for navigation
- Axios for API communication
- Vite for build tooling
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for different routes
- `/src/services` - API service functions
- `/src/styles` - CSS stylesheets
- `/src/assets` - Static assets like images

## API Integration

The frontend communicates with the backend API through the services defined in `/src/services/api.js`. The API base URL is configured to use a proxy in development mode, which forwards requests to the backend server.

## Deployment

To deploy the application:

1. Build the production version:

   ```
   npm run build
   ```

2. The built files will be in the `dist` directory, which can be served by the backend Express server or any static file server.
