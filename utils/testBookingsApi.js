const mongoose = require("mongoose");
const Booking = require("../model/Booking");
const User = require("../model/User");
require("dotenv").config();

// This script tests direct database access to bookings
// Run with: node utils/testBookingsApi.js

async function testBookingFetch() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(
			process.env.MONGODB_URI || "mongodb://localhost:27017/photo-booth-booking"
		);
		console.log("Connected to MongoDB");

		// Test 1: Get all bookings without populate
		console.log("\n--- Test 1: Fetch all bookings without populate ---");
		const bookings = await Booking.find({}).sort({ createdAt: -1 });
		console.log(`Found ${bookings.length} bookings`);

		if (bookings.length > 0) {
			console.log("First booking sample:");
			console.log(JSON.stringify(bookings[0], null, 2));
		}

		// Test 2: Check all users referenced in bookings
		console.log("\n--- Test 2: Check user references in bookings ---");
		let invalidUserRefs = 0;

		for (const booking of bookings) {
			const userId = booking.user;
			const user = await User.findById(userId);

			if (!user) {
				console.log(
					`❌ Invalid user reference in booking ${booking._id}: ${userId}`
				);
				invalidUserRefs++;
			}
		}

		if (invalidUserRefs === 0) {
			console.log("✅ All user references are valid");
		} else {
			console.log(`❌ Found ${invalidUserRefs} invalid user references`);
		}

		// Test 3: Try populate
		console.log("\n--- Test 3: Test populate function ---");
		try {
			const populatedBookings = await Booking.find({})
				.populate("user", "name email")
				.sort({ createdAt: -1 });

			console.log(
				`Successfully populated ${populatedBookings.length} bookings`
			);

			if (populatedBookings.length > 0) {
				console.log("First populated booking sample:");
				console.log(JSON.stringify(populatedBookings[0], null, 2));
			}
		} catch (err) {
			console.error("❌ Error during populate:", err);
		}
	} catch (error) {
		console.error("Error in test script:", error);
	} finally {
		console.log("\nClosing database connection...");
		await mongoose.connection.close();
		console.log("Database connection closed");
	}
}

testBookingFetch();
