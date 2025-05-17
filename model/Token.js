const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ["access", "refresh"],
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
	isRevoked: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: "30d", // Automatically remove documents after 30 days
	},
});

// Add index for faster lookups
tokenSchema.index({ token: 1 });
tokenSchema.index({ userId: 1 });
tokenSchema.index({ expiresAt: 1 });

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
