const User = require("./model/User");
const tokenService = require("./utils/tokenService");
require("dotenv").config();

// Middleware to verify JWT token or use Passport session
const authenticateToken = async (req, res, next) => {
	// If user is authenticated via Passport session
	if (req.isAuthenticated()) {
		return next();
	}

	try {
		// Try to get token from cookie first (more secure)
		let token = req.cookies.accessToken;

		// Fallback to Authorization header if no cookie
		if (!token) {
			token = req.header("Authorization")?.replace("Bearer ", "");
		}

		if (!token) {
			return res.status(401).json({
				error: "Authentication required",
				isAuthenticated: false,
			});
		}

		// Verify token using token service (checks if revoked)
		const decoded = await tokenService.verifyToken(token);

		if (!decoded) {
			return res.status(401).json({
				error: "Invalid or expired token",
				isAuthenticated: false,
			});
		}

		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({
				error: "User not found",
				isAuthenticated: false,
			});
		}

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
	// First ensure the user is authenticated
	authenticateToken(req, res, () => {
		// If user exists and is admin, proceed
		if (req.user && req.user.isAdmin) {
			return next();
		}

		// Otherwise, deny access
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
