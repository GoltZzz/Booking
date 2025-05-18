const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const packageRoutes = require("./routes/packageRoutes");
const adminRoutes = require("./routes/adminRoutes");

const packageController = require("./controller/packageController");

const app = express();
const port = process.env.PORT || 3000;

app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
		credentials: true,
	})
);

app.use((req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
	next();
});

app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: [
					"'self'",
					"https://cdnjs.cloudflare.com",
					"https://accounts.google.com",
					"https://apis.google.com",
					"https://ssl.gstatic.com",
					"https://www.gstatic.com",
					(req, res) => `'nonce-${res.locals.cspNonce}'`,
				],
				styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
				imgSrc: ["'self'", "data:", "https:"],
				fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
				connectSrc: [
					"'self'",
					"https://accounts.google.com",
					"https://www.googleapis.com",
				],
				frameSrc: ["'self'", "https://accounts.google.com"],
			},
		},
		crossOriginOpenerPolicy: {
			policy: "same-origin-allow-popups",
		},
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	session({
		secret: process.env.SESSION_SECRET || "your-session-secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
	console.error("Global Error Handler:", err);
	res.status(500).json({
		error: "An unexpected error occurred",
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
	});
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client/dist", "index.html"));
	});
}

mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/photo-booth-booking"
	)
	.then(() => {
		console.log("Connected to MongoDB");
		packageController.createDefaultPackages();
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception:", error);
});
