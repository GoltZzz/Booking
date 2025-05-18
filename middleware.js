const User = require("./model/User");
const tokenService = require("./utils/tokenService");
require("dotenv").config();

// Middleware to verify JWT token or use Passport session
const authenticateToken = async (req, res, next) => {
	console.log("authenticateToken middleware called");

	// If user is authenticated via Passport session
	if (req.isAuthenticated() && req.user) {
		console.log("User authenticated via Passport session:", req.user.email);
		return next();
	}

	try {
		// Try to get token from cookie first (more secure)
		let token = req.cookies.accessToken;
		console.log("Token from cookie:", token ? "Found" : "Not found");

		// Fallback to Authorization header if no cookie
		if (!token) {
			const authHeader = req.header("Authorization");
			token = authHeader?.startsWith("Bearer ")
				? authHeader.substring(7)
				: authHeader;
			console.log(
				"Token from Authorization header:",
				token ? "Found" : "Not found"
			);
		}

		if (!token) {
			console.log("No authentication token found");
			return res.status(401).json({
				error: "Authentication required",
				isAuthenticated: false,
			});
		}

		// Verify token using token service (checks if revoked)
		const decoded = await tokenService.verifyToken(token);
		console.log("Token verification result:", decoded ? "Valid" : "Invalid");

		if (!decoded) {
			console.log("Token is invalid or expired");
			return res.status(401).json({
				error: "Invalid or expired token",
				isAuthenticated: false,
			});
		}

		// Find the user by ID
		const user = await User.findById(decoded.userId);
		console.log("User found:", user ? user.email : "No user");

		if (!user) {
			console.log("User not found for token");
			return res.status(401).json({
				error: "User not found",
				isAuthenticated: false,
			});
		}

		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(401).json({
			error: "Authentication failed",
			isAuthenticated: false,
		});
	}
};

// Ensure user is authenticated via Passport session
const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({
		error: "Please log in to access this resource",
		isAuthenticated: false,
	});
};

// Admin middleware - checks if authenticated user is an admin
const requireAdmin = (req, res, next) => {
	console.log("requireAdmin middleware called");

	// First ensure the user is authenticated
	authenticateToken(req, res, () => {
		// Log authentication state
		console.log("User authenticated:", !!req.user);
		console.log("User admin status:", req.user ? req.user.isAdmin : "No user");

		// If user exists and is admin, proceed
		if (req.user && req.user.isAdmin) {
			console.log("Admin access granted for user:", req.user.email);
			return next();
		}

		// Otherwise, deny access
		console.log("Admin access denied - user is not admin");
		return res.status(403).json({
			error: "Access denied. Admin privileges required.",
			isAuthenticated: true,
			isAuthorized: false,
		});
	});
};

module.exports = {
	authenticateToken,
	ensureAuthenticated,
	requireAdmin,
};
