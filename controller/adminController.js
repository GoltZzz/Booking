const User = require("../model/User");
const Booking = require("../model/Booking");

/**
 * Get dashboard statistics for the admin panel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStats = async (req, res) => {
	try {
		// Get user counts
		const userCount = await User.countDocuments();

		// Get booking counts
		const bookingCount = await Booking.countDocuments();
		const pendingBookings = await Booking.countDocuments({ status: "pending" });
		const confirmedBookings = await Booking.countDocuments({
			status: "confirmed",
		});

		// Get recent bookings (last 5)
		const recentBookings = await Booking.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.populate("user", "name email")
			.lean();

		// Get recent users (last 5)
		const recentUsers = await User.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.select("name email createdAt")
			.lean();

		// Return statistics
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
		console.error("Error getting admin stats:", error);
		res.status(500).json({ error: "Failed to get dashboard statistics" });
	}
};

/**
 * Get all users for admin management
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find()
			.select("-password")
			.sort({ createdAt: -1 })
			.lean();

		res.json(users);
	} catch (error) {
		console.error("Error getting all users:", error);
		res.status(500).json({ error: "Failed to get users" });
	}
};

/**
 * Update a user's information (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, isAdmin, phone } = req.body;

		// Find user and update
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				name,
				email,
				isAdmin,
				phone,
			},
			{ new: true }
		).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(updatedUser);
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};

/**
 * Delete a user (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		// Find and delete the user
		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Also delete all bookings from this user
		await Booking.deleteMany({ user: id });

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};

module.exports = {
	getStats,
	getAllUsers,
	updateUser,
	deleteUser,
};
