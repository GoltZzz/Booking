const Booking = require("../model/Booking");
const User = require("../model/User");
const Package = require("../model/Package");
const emailService = require("../utils/emailService");
const moment = require("moment");

// Create a new booking
const createBooking = async (req, res) => {
	try {
		const {
			bookingDate,
			startTime,
			endTime,
			duration,
			packageType,
			specialRequests,
		} = req.body;

		// Find the package to get the price
		const packageDetails = await Package.findOne({ name: packageType });
		if (!packageDetails) {
			return res.status(404).json({ error: "Package not found" });
		}

		// Calculate total price
		const totalPrice = packageDetails.price;

		// Create booking
		const booking = new Booking({
			user: req.user._id,
			bookingDate,
			startTime,
			endTime,
			duration,
			packageType,
			totalPrice,
			specialRequests,
			status: "pending",
		});

		await booking.save();

		// Send confirmation email
		try {
			await emailService.sendBookingConfirmation(booking, req.user);
		} catch (emailError) {
			console.error("Failed to send email:", emailError);
			// Continue with the booking process even if email fails
		}

		res.status(201).json({
			message: "Booking created successfully",
			booking,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get all bookings for the logged-in user
const getUserBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({ user: req.user._id }).sort({
			bookingDate: -1,
		});
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get a specific booking by ID
const getBookingById = async (req, res) => {
	try {
		const booking = await Booking.findOne({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}

		res.json(booking);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update booking status
const updateBookingStatus = async (req, res) => {
	try {
		const { status } = req.body;

		const booking = await Booking.findOne({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}

		booking.status = status;
		await booking.save();

		res.json({
			message: "Booking status updated successfully",
			booking,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Check available time slots for a specific date
const checkAvailability = async (req, res) => {
	try {
		const { date } = req.params;
		const bookingDate = moment(date).startOf("day").toDate();
		const nextDay = moment(date).add(1, "days").startOf("day").toDate();

		// Find all bookings for the specified date
		const bookings = await Booking.find({
			bookingDate: {
				$gte: bookingDate,
				$lt: nextDay,
			},
			status: { $ne: "cancelled" },
		});

		// Business hours (example: 9 AM to 9 PM)
		const businessHours = {
			start: "09:00",
			end: "21:00",
		};

		// Create time slots (hourly)
		const timeSlots = [];
		let currentHour = parseInt(businessHours.start.split(":")[0]);
		const endHour = parseInt(businessHours.end.split(":")[0]);

		while (currentHour < endHour) {
			const startTime = `${currentHour.toString().padStart(2, "0")}:00`;
			const endTime = `${(currentHour + 1).toString().padStart(2, "0")}:00`;

			// Check if this time slot is available
			const isBooked = bookings.some(
				(booking) =>
					booking.startTime <= startTime && booking.endTime > startTime
			);

			timeSlots.push({
				startTime,
				endTime,
				available: !isBooked,
			});

			currentHour++;
		}

		res.json(timeSlots);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createBooking,
	getUserBookings,
	getBookingById,
	updateBookingStatus,
	checkAvailability,
};
