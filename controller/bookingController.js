const Booking = require("../model/Booking");
const User = require("../model/User");
const Package = require("../model/Package");
const emailService = require("../utils/emailService");
const moment = require("moment");

const createBooking = async (req, res) => {
	try {
		const {
			bookingDate,
			startTime,
			endTime,
			duration,
			category,
			packageType,
			specialRequests,
		} = req.body;

		const packageDetails = await Package.findOne({ name: packageType });
		if (!packageDetails) {
			return res.status(404).json({ error: "Package not found" });
		}

		const totalPrice = packageDetails.price;

		const booking = new Booking({
			user: req.user._id,
			bookingDate,
			startTime,
			endTime,
			duration,
			category,
			packageType,
			totalPrice,
			specialRequests,
			status: "pending",
		});

		await booking.save();

		try {
			await emailService.sendBookingConfirmation(booking, req.user);
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
			bookingDate: -1,
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

const checkAvailability = async (req, res) => {
	try {
		const { date } = req.params;
		const bookingDate = moment(date).startOf("day").toDate();
		const nextDay = moment(date).add(1, "days").startOf("day").toDate();

		const bookings = await Booking.find({
			bookingDate: {
				$gte: bookingDate,
				$lt: nextDay,
			},
			status: { $ne: "cancelled" },
		});

		const businessHours = {
			start: "09:00",
			end: "21:00",
		};

		const timeSlots = [];
		let currentHour = parseInt(businessHours.start.split(":")[0]);
		const endHour = parseInt(businessHours.end.split(":")[0]);

		while (currentHour < endHour) {
			const startTime = `${currentHour.toString().padStart(2, "0")}:00`;
			const endTime = `${(currentHour + 1).toString().padStart(2, "0")}:00`;

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
