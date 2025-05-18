const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		// Not required for OAuth users
	},
	phone: {
		type: String,
	},
	googleId: {
		type: String,
		sparse: true,
		unique: true,
	},
	profilePicture: {
		type: String,
	},
	authMethod: {
		type: String,
		enum: ["local", "google"],
		default: "local",
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre("save", async function (next) {
	// Only hash the password if it's modified and exists (for local auth)
	if (!this.isModified("password") || !this.password) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	if (!this.password) return false;
	return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
