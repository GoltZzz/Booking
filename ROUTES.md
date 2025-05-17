# API Routes Documentation

## User Routes (`/api/users`)

| Method | Endpoint                | Description                   | Auth Required |
| ------ | ----------------------- | ----------------------------- | ------------- |
| POST   | `/register`             | Register a new user           | No            |
| POST   | `/login`                | Login with email and password | No            |
| GET    | `/me`                   | Get current user profile      | Yes           |
| GET    | `/auth/google`          | Initiate Google OAuth login   | No            |
| GET    | `/auth/google/callback` | Google OAuth callback URL     | No            |
| POST   | `/logout`               | Logout current user           | Yes           |
| PUT    | `/profile`              | Update user profile           | Yes           |

## Booking Routes (`/api/bookings`)

| Method | Endpoint | Description                       | Auth Required |
| ------ | -------- | --------------------------------- | ------------- |
| GET    | `/`      | Get all bookings for current user | Yes           |
| POST   | `/`      | Create a new booking              | Yes           |
| GET    | `/:id`   | Get booking by ID                 | Yes           |
| PUT    | `/:id`   | Update booking                    | Yes           |
| DELETE | `/:id`   | Cancel booking                    | Yes           |

## Package Routes (`/api/packages`)

| Method | Endpoint | Description                | Auth Required |
| ------ | -------- | -------------------------- | ------------- |
| GET    | `/`      | Get all available packages | No            |

## Admin Routes (`/api/admin`)

| Method | Endpoint        | Description              | Auth Required |
| ------ | --------------- | ------------------------ | ------------- |
| GET    | `/users`        | Get all users            | Admin         |
| GET    | `/users/:id`    | Get user by ID           | Admin         |
| PUT    | `/users/:id`    | Update user              | Admin         |
| DELETE | `/users/:id`    | Delete user              | Admin         |
| GET    | `/bookings`     | Get all bookings         | Admin         |
| GET    | `/bookings/:id` | Get booking by ID        | Admin         |
| PUT    | `/bookings/:id` | Update booking status    | Admin         |
| DELETE | `/bookings/:id` | Delete booking           | Admin         |
| GET    | `/packages`     | Get all packages         | Admin         |
| POST   | `/packages`     | Create new package       | Admin         |
| PUT    | `/packages/:id` | Update package           | Admin         |
| DELETE | `/packages/:id` | Delete package           | Admin         |
| GET    | `/dashboard`    | Get admin dashboard data | Admin         |

## Authentication

The API uses two authentication methods:

1. JWT tokens (sent in the Authorization header)
2. Passport.js sessions (for web browser clients)

Protected routes require either a valid JWT token or an active session.
Admin routes require admin privileges in addition to authentication.
