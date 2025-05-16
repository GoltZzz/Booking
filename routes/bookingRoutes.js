const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authenticateToken } = require("../middleware");

router.use(authenticateToken);

// Booking routes
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getUserBookings);
router.get("/:id", bookingController.getBookingById);
router.patch("/:id/status", bookingController.updateBookingStatus);
router.get("/availability/:date", bookingController.checkAvailability);

module.exports = router;
