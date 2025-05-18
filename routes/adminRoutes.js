const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware");
const User = require("../model/User");
const Booking = require("../model/Booking");

router.use(requireAdmin);

router.get("/users", async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/users/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.patch("/users/:id", async (req, res) => {
	try {
		const { name, email, phone, isAdmin } = req.body;
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ name, email, phone, isAdmin },
			{ new: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/users/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/bookings", async (req, res) => {
	try {
		const bookings = await Booking.find().populate("user", "name email");
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/bookings/:id", async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id).populate(
			"user",
			"name email"
		);
		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}
		res.json(booking);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.patch("/bookings/:id", async (req, res) => {
	try {
		const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		}).populate("user", "name email");

		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}

		res.json(booking);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/bookings/:id", async (req, res) => {
	try {
		const booking = await Booking.findByIdAndDelete(req.params.id);
		if (!booking) {
			return res.status(404).json({ error: "Booking not found" });
		}
		res.json({ message: "Booking deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/stats", async (req, res) => {
	try {
		const userCount = await User.countDocuments();
		const bookingCount = await Booking.countDocuments();
		const pendingBookings = await Booking.countDocuments({ status: "pending" });
		const confirmedBookings = await Booking.countDocuments({
			status: "confirmed",
		});

		const recentBookings = await Booking.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.populate("user", "name email");

		const recentUsers = await User.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.select("-password");

		res.json({
			stats: {
				userCount,
				bookingCount,
				pendingBookings,
				confirmedBookings,
			},
			recentBookings,
			recentUsers,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
