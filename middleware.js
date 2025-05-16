const jwt = require("jsonwebtoken");
const User = require("./model/User");
require("dotenv").config();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({ error: "Authentication required" });
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-fallback-secret"
		);
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}

		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		res.status(401).json({ error: "Please authenticate" });
	}
};

module.exports = {
	authenticateToken,
};
