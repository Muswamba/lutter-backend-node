const express = require("express");
const AuthController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);
router.get("/profile", verifyToken, AuthController.getProfile);
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
