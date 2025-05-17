const User = require("../model/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

const register = async (req, res) => {
	try {
		const { name, email, password, phone } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: "Email already in use" });
		}

		// Check if this is the first user being registered
		const userCount = await User.countDocuments();
		const isFirstUser = userCount === 0;

		const user = new User({
			name,
			email,
			password,
			phone,
			authMethod: "local",
			isAdmin: isFirstUser, // First user gets admin privileges
		});

		await user.save();

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id, isAdmin: user.isAdmin },
			process.env.JWT_SECRET || "your-fallback-secret",
			{ expiresIn: "7d" }
		);

		// Log the user in with Passport
		req.login(user, (err) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}

			res.status(201).json({
				message: "User registered successfully",
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					authMethod: user.authMethod,
					profilePicture: user.profilePicture,
					isAdmin: user.isAdmin,
				},
				token,
				isAuthenticated: true,
			});
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const login = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res
				.status(401)
				.json({ error: info.message || "Invalid email or password" });
		}

		req.login(user, (err) => {
			if (err) {
				return next(err);
			}

			// Generate JWT token for API authentication
			const token = jwt.sign(
				{ userId: user._id, isAdmin: user.isAdmin },
				process.env.JWT_SECRET || "your-fallback-secret",
				{ expiresIn: "7d" }
			);

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
				token,
				isAuthenticated: true,
			});
		});
	})(req, res, next);
};

const googleAuthCallback = (req, res) => {
	// User has been authenticated and stored in req.user
	const user = req.user;

	// Generate JWT token for API authentication
	const token = jwt.sign(
		{ userId: user._id, isAdmin: user.isAdmin },
		process.env.JWT_SECRET || "your-fallback-secret",
		{ expiresIn: "7d" }
	);

	// Get the client URL
	const clientUrl =
		process.env.NODE_ENV === "production"
			? process.env.CLIENT_URL || "/"
			: "http://localhost:5173";

	// Redirect to frontend with token as a query parameter
	// This avoids using hash fragments which can cause CSP issues
	res.redirect(`${clientUrl}/auth/google/success?token=${token}`);
};

const logout = (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json({ message: "Logged out successfully", isAuthenticated: false });
	});
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
	if (req.isAuthenticated()) {
		return res.json({
			isAuthenticated: true,
			user: {
				id: req.user._id,
				name: req.user.name,
				email: req.user.email,
				authMethod: req.user.authMethod,
				profilePicture: req.user.profilePicture,
				isAdmin: req.user.isAdmin,
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
	getProfile,
	checkAuth,
};
