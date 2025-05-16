const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authenticateToken } = require("../middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/profile", authenticateToken, userController.getProfile);

module.exports = router;
