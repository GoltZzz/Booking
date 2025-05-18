# Authentication in the Booking System

This document explains how the different authentication mechanisms work in the MJ Studios Photo Booth Booking System.

## Authentication Methods

The application uses a dual authentication system:

1. **Session-based Authentication** (using cookies) - Primarily for browser clients
2. **JWT-based Authentication** - Primarily for API clients or mobile apps

## Session-based Authentication

### How It Works

1. **Login Process**:

   - User submits credentials via login form or clicks "Sign in with Google"
   - Server validates credentials or processes OAuth authentication
   - Server creates a session and stores session ID in a cookie
   - Session data is stored server-side (in memory by default)

2. **Session Configuration**:

   ```javascript
   // From index.js
   app.use(
   	session({
   		secret: process.env.SESSION_SECRET || "your-session-secret",
   		resave: false,
   		saveUninitialized: false,
   		cookie: {
   			secure: process.env.NODE_ENV === "production",
   			maxAge: 24 * 60 * 60 * 1000, // 24 hours
   		},
   	})
   );
   ```

3. **Passport.js Integration**:

   - Passport middleware initializes and manages user sessions
   - User data is serialized/deserialized to/from the session

   ```javascript
   // From config/passport.js
   passport.serializeUser((user, done) => {
   	done(null, user.id);
   });

   passport.deserializeUser(async (id, done) => {
   	try {
   		const user = await User.findById(id);
   		done(null, user);
   	} catch (err) {
   		done(err);
   	}
   });
   ```

4. **Session Verification**:
   - For protected routes, the `ensureAuthenticated` middleware checks if the user is logged in
   ```javascript
   // From middleware.js
   const ensureAuthenticated = (req, res, next) => {
   	if (req.isAuthenticated()) {
   		return next();
   	}
   	res.status(401).json({
   		error: "Please log in to access this resource",
   		isAuthenticated: false,
   	});
   };
   ```

## JWT-based Authentication

### How It Works

1. **Token Generation**:

   - User submits credentials via API
   - Server validates credentials
   - Server generates a JWT containing user information and signs it with a secret key
   - Token is returned to the client

2. **JWT Creation**:

   ```javascript
   // From userController.js (simplified)
   const token = jwt.sign(
   	{ userId: user._id },
   	process.env.JWT_SECRET || "your-fallback-secret",
   	{ expiresIn: "24h" }
   );
   ```

3. **Token Verification**:

   - For protected API routes, the `authenticateToken` middleware verifies the JWT

   ```javascript
   // From middleware.js
   const authenticateToken = async (req, res, next) => {
   	try {
   		const token = req.header("Authorization")?.replace("Bearer ", "");

   		if (!token) {
   			return res.status(401).json({
   				error: "Authentication required",
   				isAuthenticated: false,
   			});
   		}

   		const decoded = jwt.verify(token, process.env.JWT_SECRET);
   		const user = await User.findById(decoded.userId);

   		req.user = user;
   		req.token = token;
   		next();
   	} catch (error) {
   		res.status(401).json({
   			error: "Please authenticate",
   			isAuthenticated: false,
   		});
   	}
   };
   ```

## Creating JWT Tokens

### JWT Structure

A JWT token consists of three parts separated by dots (`.`):

1. **Header**: Contains the algorithm and token type

   ```json
   {
   	"alg": "HS256",
   	"typ": "JWT"
   }
   ```

2. **Payload**: Contains the claims (data)

   ```json
   {
   	"userId": "60d21b4667d0d8992e610c85",
   	"iat": 1624365867,
   	"exp": 1624452267
   }
   ```

3. **Signature**: Used to verify the token hasn't been tampered with
   ```
   HMACSHA256(
     base64UrlEncode(header) + "." + base64UrlEncode(payload),
     JWT_SECRET
   )
   ```

### Implementation in the Booking System

The booking system creates JWT tokens during user login:

```javascript
// Example from userController.js
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Verify password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Create JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || "your-fallback-secret",
			{ expiresIn: "24h" }
		);

		// Return user data and token
		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
```

## Using JWT Tokens

### Client-Side Implementation

#### 1. Storing the Token

After a successful login, store the JWT token securely:

```javascript
// React example using a secure-httponly cookie approach (recommended)
// This would require server-side cookie setting
fetch("/api/users/login", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ email, password }),
	credentials: "include", // Important for cookies
})
	.then((res) => res.json())
	.then((data) => {
		// Token is stored in HTTP-only cookie by the server
		// Store user data in state/context
		setUser(data.user);
	});

// Alternative: localStorage approach (less secure but simpler)
fetch("/api/users/login", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ email, password }),
})
	.then((res) => res.json())
	.then((data) => {
		localStorage.setItem("token", data.token);
		setUser(data.user);
	});
```

#### 2. Using the Token for API Requests

Include the token in the Authorization header for protected API requests:

```javascript
// React example using the token from localStorage
const fetchUserBookings = async () => {
	const token = localStorage.getItem("token");

	try {
		const response = await fetch("/api/bookings", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Authentication failed");
		}

		const bookings = await response.json();
		return bookings;
	} catch (error) {
		console.error("Error fetching bookings:", error);
		// Handle authentication errors (e.g., redirect to login)
		if (error.message === "Authentication failed") {
			// Clear token and redirect to login
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return [];
	}
};
```

#### 3. Creating an Axios Instance with Auth Headers

For a more organized approach, create an API client with the token automatically included:

```javascript
// api.js - Axios instance with auth interceptor
import axios from "axios";

const api = axios.create({
	baseURL: "/api",
});

// Request interceptor to add token to all requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default api;

// Usage in components:
// import api from '../utils/api';
// api.get('/bookings').then(response => setBookings(response.data));
```

### Server-Side Implementation

#### 1. Protecting Routes

Use the `authenticateToken` middleware to protect routes:

```javascript
// bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authenticateToken } = require("../middleware");

// Apply middleware to all routes in this router
router.use(authenticateToken);

// All these routes are protected
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getUserBookings);
router.get("/:id", bookingController.getBookingById);

module.exports = router;
```

#### 2. Accessing User Data in Protected Routes

After authentication, the user object is available in `req.user`:

```javascript
// Example controller function
exports.getUserBookings = async (req, res) => {
	try {
		// req.user is available from the authenticateToken middleware
		const userId = req.user._id;

		const bookings = await Booking.find({ user: userId });
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
```

## Unified Authentication Flow

The booking system uses a clever approach that checks for both authentication methods:

```javascript
// From middleware.js
const authenticateToken = async (req, res, next) => {
	// If user is authenticated via Passport session
	if (req.isAuthenticated()) {
		return next();
	}

	// Otherwise, try JWT authentication
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");
		// JWT verification logic...
	} catch (error) {
		// Authentication failed
	}
};
```

## Authentication Flow Examples

### Web Browser Flow (Session-based)

1. User logs in through the web interface
2. Server creates a session and sets a cookie
3. Browser automatically includes the cookie in subsequent requests
4. Server validates the session on each request
5. When user logs out, session is destroyed

### API Client Flow (JWT-based)

1. Client sends credentials to `/api/users/login`
2. Server returns a JWT token
3. Client stores the token (e.g., in localStorage)
4. Client includes the token in the Authorization header for subsequent requests
5. Server validates the token on each request

## Security Considerations

1. **Session Security**:

   - Sessions are protected by the `SESSION_SECRET` environment variable
   - In production, cookies are set with the `secure` flag (requires HTTPS)
   - Sessions expire after 24 hours

2. **JWT Security**:

   - Tokens are signed with the `JWT_SECRET` environment variable
   - Tokens expire after 24 hours
   - Tokens should be stored securely by clients
   - Never store sensitive data in JWT payloads (they are base64 encoded, not encrypted)
   - Use HTTPS to prevent token interception

3. **CSRF Protection**:
   - The application uses Helmet security middleware to help protect against CSRF attacks

## Best Practices

1. Always use HTTPS in production
2. Store JWT tokens securely (prefer HTTP-only cookies over localStorage)
3. Keep session and JWT secrets secure and different from each other
4. Implement token refresh mechanisms for long-lived applications
5. Set appropriate token expiration times
6. Include only necessary data in the JWT payload
7. Implement token revocation for logout functionality (e.g., using a blacklist or Redis)
