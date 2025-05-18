const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authenticateToken, requireAdmin } = require("../middleware");

// Regular user booking routes (protected by authentication)
router.use(authenticateToken);
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getUserBookings);

// Admin only routes - MUST come before the /:id route to avoid conflicts
router.get(
	"/all",
	// Debug middleware for /all route
	(req, res, next) => {
		console.log("==== DEBUG /api/bookings/all ====");
		console.log("Headers:", JSON.stringify(req.headers));
		console.log("Cookies:", req.cookies);
		console.log("Session:", req.session);
		console.log("Authenticated via Passport:", req.isAuthenticated());
		console.log("================================");
		next();
	},
	// Standard admin middleware
	requireAdmin,
	// Error handling wrapper for controller
	(req, res, next) => {
		try {
			bookingController.getAllBookings(req, res, next);
		} catch (error) {
			console.error("Error in getAllBookings controller:", error);
			res.status(500).json({
				error: "Internal server error",
				details: error.message,
			});
		}
	}
);

// Admin endpoints for managing specific bookings
router.put("/:id/confirm", requireAdmin, bookingController.confirmBooking);
router.put("/:id/status", requireAdmin, bookingController.updateBookingStatus);

// This route must come AFTER more specific routes to avoid capturing them
router.get("/:id", bookingController.getBookingById);

module.exports = router;
