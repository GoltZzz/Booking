const Booking = require("../model/Booking");
const User = require("../model/User");
const emailService = require("../utils/emailService");
const moment = require("moment");

const createBooking = async (req, res) => {
	try {
		const { eventType, eventDate, specialRequest } = req.body;

		const booking = new Booking({
			user: req.user._id,
			eventType,
			eventDate,
			specialRequest,
			status: "pending",
		});

		await booking.save();

		// Find admin users to notify
		const adminUsers = await User.find({ isAdmin: true });

		try {
			// Send notification to admin(s)
			if (adminUsers.length > 0) {
				const adminEmail = adminUsers[0].email;
				const notificationResult =
					await emailService.sendNewBookingNotification(
						booking,
						req.user,
						adminEmail
					);

				if (notificationResult && notificationResult.mailgunRestriction) {
					console.log(
						`⚠️ Email to admin skipped: ${notificationResult.reason}`
					);
				} else {
					console.log(
						`Admin notification email sent to ${adminEmail}:`,
						notificationResult
					);
				}
			}

			// Send confirmation to user
			const confirmationResult = await emailService.sendBookingConfirmation(
				booking,
				req.user
			);

			if (confirmationResult && confirmationResult.mailgunRestriction) {
				console.log(`⚠️ Email to user skipped: ${confirmationResult.reason}`);
			} else {
				console.log(
					`Booking confirmation email sent to ${req.user.email}:`,
					confirmationResult
				);
			}
		} catch (emailError) {
			console.error("Failed to send email:", emailError);
		}

		res.status(201).json({
			message: "Booking created successfully",
			booking,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUserBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({ user: req.user._id }).sort({
			eventDate: -1,
		});
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

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

const updateBookingStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const bookingId = req.params.id;

		const booking = await Booking.findById(bookingId).populate("user");

		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}

		booking.status = status;
		await booking.save();

		// If the booking is confirmed, send a confirmation email to the user
		if (status === "confirmed") {
			try {
				const user = await User.findById(booking.user);
				const emailResult = await emailService.sendBookingStatusUpdate(
					booking,
					user
				);

				if (emailResult && emailResult.mailgunRestriction) {
					console.log(`⚠️ Confirmation email skipped: ${emailResult.reason}`);
					console.log(
						`To fix: Add ${user.email} as an authorized recipient in your Mailgun sandbox domain settings`
					);
				} else {
					console.log(
						`Booking status update email sent to ${user.email}:`,
						emailResult
					);
					console.log(`Email sent at: ${new Date().toISOString()}`);
				}
			} catch (emailError) {
				console.error("Failed to send confirmation email:", emailError);
			}
		}

		res.json({
			message: "Booking status updated successfully",
			booking,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllBookings = async (req, res) => {
	try {
		console.log("Fetching all bookings");
		console.log("User:", req.user);

		// First try without populate to isolate the issue
		const bookings = await Booking.find({}).sort({ createdAt: -1 });
		console.log(`Found ${bookings.length} bookings (before populate)`);

		// Then populate
		const populatedBookings = await Booking.find({})
			.populate("user", "name email")
			.sort({ createdAt: -1 });

		console.log(`Found ${populatedBookings.length} bookings (after populate)`);
		res.json(populatedBookings);
	} catch (error) {
		console.error("ERROR in getAllBookings:", error);
		console.error("Full error stack:", error.stack);
		res
			.status(500)
			.json({ error: error.message || "An unexpected error occurred" });
	}
};

const confirmBooking = async (req, res) => {
	try {
		const bookingId = req.params.id;
		const booking = await Booking.findById(bookingId).populate("user");

		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}

		booking.status = "confirmed";
		await booking.save();

		// Send confirmation email to the user
		try {
			const user = await User.findById(booking.user);
			const emailResult = await emailService.sendBookingStatusUpdate(
				booking,
				user
			);

			if (emailResult && emailResult.mailgunRestriction) {
				console.log(`⚠️ Confirmation email skipped: ${emailResult.reason}`);
				console.log(
					`To fix: Add ${user.email} as an authorized recipient in your Mailgun sandbox domain settings`
				);
			} else {
				console.log(
					`Booking confirmation email sent to ${user.email}:`,
					emailResult
				);
				console.log(`Email sent at: ${new Date().toISOString()}`);
			}
		} catch (emailError) {
			console.error("Failed to send confirmation email:", emailError);
		}

		res.json({
			message: "Booking confirmed successfully",
			booking,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createBooking,
	getUserBookings,
	getBookingById,
	updateBookingStatus,
	getAllBookings,
	confirmBooking,
};
