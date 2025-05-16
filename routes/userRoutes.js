const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authenticateToken } = require("../middleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", authenticateToken, userController.getProfile);

module.exports = router;
