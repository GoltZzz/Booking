const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	eventType: {
		type: String,
		required: true,
	},
	eventDate: {
		type: Date,
		required: true,
	},
	specialRequest: {
		type: String,
	},
	status: {
		type: String,
		enum: ["pending", "confirmed", "cancelled"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
