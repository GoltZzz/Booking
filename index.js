const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const packageRoutes = require("./routes/packageRoutes");

// Import controllers
const packageController = require("./controller/packageController");

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client/dist", "index.html"));
	});
}

// Connect to MongoDB
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/photo-booth-booking"
	)
	.then(() => {
		console.log("Connected to MongoDB");
		// Create default packages
		packageController.createDefaultPackages();
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});

// Start server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
