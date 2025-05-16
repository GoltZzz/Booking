const express = require("express");
const router = express.Router();
const packageController = require("../controller/packageController");

router.get("/", packageController.getAllPackages);
router.get("/:id", packageController.getPackageById);

module.exports = router;
