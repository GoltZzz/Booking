const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register a new user
const register = async (req, res) => {
	try {
		const { name, email, password, phone } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: "Email already in use" });
		}

		// Create new user
		const user = new User({
			name,
			email,
			password,
			phone,
		});

		await user.save();

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || "your-fallback-secret",
			{ expiresIn: "7d" }
		);

		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Login user
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Check password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || "your-fallback-secret",
			{ expiresIn: "7d" }
		);

		res.json({
			message: "Login successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get user profile
const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	register,
	login,
	getProfile,
};
