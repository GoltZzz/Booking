const User = require("../model/User");
const tokenService = require("../utils/tokenService");
const passport = require("passport");
require("dotenv").config();

// Cookie options
const cookieOptions = {
	httpOnly: true, // Prevent JavaScript access
	secure: process.env.NODE_ENV === "production", // HTTPS only in production
	sameSite: "strict", // Prevent CSRF
	maxAge: 3600000, // 1 hour for access token
};

const refreshCookieOptions = {
	...cookieOptions,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
	path: "/api/users/refresh", // Only send to refresh endpoint
};

const register = async (req, res) => {
	try {
		console.log("Register endpoint called with body:", req.body);
		const { name, email, password, phone } = req.body;

		// Validation checks
		if (!name || !email || !password) {
			console.log("Missing required fields:", {
				name: !name,
				email: !email,
				password: !password,
			});
			return res.status(400).json({
				error: "Missing required fields",
				missing: {
					name: !name,
					email: !email,
					password: !password,
				},
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			console.log("Email already in use:", email);
			return res.status(400).json({ error: "Email already in use" });
		}

		// Check if this is the first user being registered
		const userCount = await User.countDocuments();
		const isFirstUser = userCount === 0;
		console.log("Is first user:", isFirstUser);

		const user = new User({
			name,
			email,
			password,
			phone,
			authMethod: "local",
			isAdmin: isFirstUser, // First user gets admin privileges
		});

		await user.save();
		console.log("User saved to database with ID:", user._id);

		// Generate tokens
		const { token: accessToken, expiresAt: accessTokenExpiry } =
			await tokenService.generateAccessToken(user);
		const { token: refreshToken, expiresAt: refreshTokenExpiry } =
			await tokenService.generateRefreshToken(user);

		// Set tokens in HTTP-only cookies
		res.cookie("accessToken", accessToken, cookieOptions);
		res.cookie("refreshToken", refreshToken, refreshCookieOptions);
		console.log("Cookies set for user");

		// Log the user in with Passport
		req.login(user, (err) => {
			if (err) {
				console.error("Passport login error:", err);
				return res.status(500).json({ error: err.message });
			}

			const responseData = {
				message: "User registered successfully",
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					authMethod: user.authMethod,
					profilePicture: user.profilePicture,
					isAdmin: user.isAdmin,
				},
				tokenExpiry: accessTokenExpiry,
				isAuthenticated: true,
			};

			console.log("Sending successful registration response:", responseData);
			res.status(201).json(responseData);
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ error: error.message });
	}
};

const login = (req, res, next) => {
	passport.authenticate("local", async (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res
				.status(401)
				.json({ error: info.message || "Invalid email or password" });
		}

		req.login(user, async (err) => {
			if (err) {
				return next(err);
			}

			// Generate tokens
			const { token: accessToken, expiresAt: accessTokenExpiry } =
				await tokenService.generateAccessToken(user);
			const { token: refreshToken, expiresAt: refreshTokenExpiry } =
				await tokenService.generateRefreshToken(user);

			// Set tokens in HTTP-only cookies
			res.cookie("accessToken", accessToken, cookieOptions);
			res.cookie("refreshToken", refreshToken, refreshCookieOptions);

			return res.json({
				message: "Login successful",
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					authMethod: user.authMethod,
					profilePicture: user.profilePicture,
					isAdmin: user.isAdmin,
				},
				tokenExpiry: accessTokenExpiry,
				isAuthenticated: true,
			});
		});
	})(req, res, next);
};

const googleAuthCallback = async (req, res) => {
	// User has been authenticated and stored in req.user
	const user = req.user;

	// Generate tokens
	const { token: accessToken, expiresAt: accessTokenExpiry } =
		await tokenService.generateAccessToken(user);
	const { token: refreshToken, expiresAt: refreshTokenExpiry } =
		await tokenService.generateRefreshToken(user);

	// Get the client URL
	const clientUrl =
		process.env.NODE_ENV === "production"
			? process.env.CLIENT_URL || "/"
			: "http://localhost:5173";

	// Set tokens in HTTP-only cookies
	// For local development, don't set domain (browser will use current domain)
	// For production, set domain only if it's not a relative URL
	const cookieSettingsAccess = { ...cookieOptions };
	const cookieSettingsRefresh = { ...refreshCookieOptions };

	// Redirect to frontend
	res.cookie("accessToken", accessToken, cookieSettingsAccess);
	res.cookie("refreshToken", refreshToken, cookieSettingsRefresh);

	res.redirect(`${clientUrl}/auth/google/success`);
};

const logout = async (req, res) => {
	try {
		// Revoke the current token if it exists
		const token =
			req.cookies.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");
		if (token) {
			await tokenService.revokeToken(token);
		}

		// Clear cookies with proper options to ensure they're removed
		res.clearCookie("accessToken", {
			httpOnly: true,
			path: "/",
			secure: process.env.NODE_ENV === "production",
		});

		res.clearCookie("refreshToken", {
			httpOnly: true,
			path: "/api/users/refresh",
			secure: process.env.NODE_ENV === "production",
		});

		// Logout from session if using Passport
		req.logout((err) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.json({ message: "Logged out successfully", isAuthenticated: false });
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({
				error: "Refresh token not found",
				isAuthenticated: false,
			});
		}

		// Generate new access token
		const result = await tokenService.refreshAccessToken(refreshToken);

		if (!result) {
			// Clear cookies if refresh token is invalid
			res.clearCookie("accessToken", {
				httpOnly: true,
				path: "/",
				secure: process.env.NODE_ENV === "production",
			});

			res.clearCookie("refreshToken", {
				httpOnly: true,
				path: "/api/users/refresh",
				secure: process.env.NODE_ENV === "production",
			});

			return res.status(401).json({
				error: "Invalid refresh token",
				isAuthenticated: false,
			});
		}

		// Set new access token in cookie
		res.cookie("accessToken", result.accessToken, cookieOptions);

		return res.json({
			message: "Token refreshed successfully",
			tokenExpiry: result.accessTokenExpiry,
			isAuthenticated: true,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getProfile = async (req, res) => {
	try {
		// If using Passport session
		const user = req.isAuthenticated()
			? req.user
			: await User.findById(req.user._id).select("-password");

		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				authMethod: user.authMethod,
				profilePicture: user.profilePicture,
				isAdmin: user.isAdmin,
			},
			isAuthenticated: true,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const checkAuth = (req, res) => {
	if (req.isAuthenticated() || req.user) {
		const user = req.user;
		return res.json({
			isAuthenticated: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				authMethod: user.authMethod,
				profilePicture: user.profilePicture,
				isAdmin: user.isAdmin,
			},
		});
	}
	res.json({ isAuthenticated: false });
};

module.exports = {
	register,
	login,
	googleAuthCallback,
	logout,
	refreshToken,
	getProfile,
	checkAuth,
};
