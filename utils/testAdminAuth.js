const jwt = require("jsonwebtoken");
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../model/User");
require("dotenv").config();

// This test script creates a dummy admin token and tests the /api/bookings/all endpoint

// Connect to MongoDB
const connectDB = async () => {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(
			process.env.MONGODB_URI || "mongodb://localhost:27017/photo-booth-booking"
		);
		console.log("Connected to MongoDB");
		return true;
	} catch (error) {
		console.error("MongoDB connection error:", error);
		return false;
	}
};

// Check if the admin user exists
const checkAdminUser = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			console.error("Admin user not found in database:", userId);
			return false;
		}

		if (!user.isAdmin) {
			console.error("User exists but is not an admin:", userId);
			return false;
		}

		console.log("Verified admin user:", user.email);
		return true;
	} catch (error) {
		console.error("Error checking admin user:", error);
		return false;
	}
};

// Function to generate a test token
const generateTestToken = (userId) => {
	const payload = {
		userId: userId,
		isAdmin: true,
		type: "access",
	};

	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Function to test the bookings API
const testBookingsAPI = async () => {
	try {
		// Connect to database
		const connected = await connectDB();
		if (!connected) {
			console.error("Cannot proceed without database connection");
			return;
		}

		// Find a real admin user
		const adminUser = await User.findOne({ isAdmin: true });
		if (!adminUser) {
			console.error(
				"No admin users found in database. Creating a test admin user..."
			);
			// Instead of throwing, let's use the existing ID but warn the user
		}

		const adminUserId = adminUser
			? adminUser._id.toString()
			: "68298e37615b5b8c15249d9f";

		// Verify the admin user exists
		const isValidAdmin = await checkAdminUser(adminUserId);
		if (!isValidAdmin) {
			console.error("Cannot proceed without valid admin user");
			await mongoose.connection.close();
			return;
		}

		const token = generateTestToken(adminUserId);
		console.log("Generated test token:", token);

		// Test the endpoint with Authorization header
		console.log("\nTesting with Authorization header...");
		try {
			const response = await axios.get(
				"http://localhost:3000/api/bookings/all",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Status:", response.status);
			console.log("Response data sample:");
			console.log(response.data.slice(0, 2)); // Show just first two bookings if there are many
		} catch (error) {
			console.error("Error with Authorization header:");
			console.error(error.response ? error.response.data : error.message);
		}

		// Test with cookie
		console.log("\nTesting with cookie...");
		try {
			const response = await axios.get(
				"http://localhost:3000/api/bookings/all",
				{
					withCredentials: true,
					headers: {
						Cookie: `accessToken=${token}`,
					},
				}
			);

			console.log("Status:", response.status);
			console.log("Response data sample:");
			console.log(response.data.slice(0, 2)); // Show just first two bookings if there are many
		} catch (error) {
			console.error("Error with cookie:");
			console.error(error.response ? error.response.data : error.message);
		}

		// Close database connection
		await mongoose.connection.close();
		console.log("Database connection closed");
	} catch (error) {
		console.error("Test error:", error);
		// Close database connection if open
		if (mongoose.connection.readyState === 1) {
			await mongoose.connection.close();
			console.log("Database connection closed");
		}
	}
};

// Run the test
testBookingsAPI();
