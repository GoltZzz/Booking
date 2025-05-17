const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authenticateToken } = require("../middleware");
const passport = require("passport");

// Local authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/check-auth", userController.checkAuth);

// Token refresh route
router.post("/refresh", userController.refreshToken);

// Google OAuth routes
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
		session: true,
	}),
	userController.googleAuthCallback
);

// Protected routes
router.get("/profile", authenticateToken, userController.getProfile);

module.exports = router;
