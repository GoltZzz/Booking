const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		enum: ["Basic", "Standard", "Premium"],
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	features: [
		{
			type: String,
		},
	],
	isAvailable: {
		type: Boolean,
		default: true,
	},
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
