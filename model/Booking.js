const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	bookingDate: {
		type: Date,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	duration: {
		type: Number, // in hours
		required: true,
	},
	packageType: {
		type: String,
		enum: ["Basic", "Standard", "Premium"],
		required: true,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "confirmed", "cancelled", "completed"],
		default: "pending",
	},
	specialRequests: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
