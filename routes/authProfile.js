const express = require("express");
const router = express.Router();

const AuthUpdateController = require("../controllers/AuthUpdateController");
const authMiddleware = require("../middleware/verifyToken"); // Middleware to check JWT
const upload = require("../utils/upload");

// Update general profile (name, avatar URL string, background URL string)
router.put("/settings", authMiddleware, AuthUpdateController.updateProfile);

// Change password with current + new password
router.post(
   "/change-password",
   authMiddleware,
   AuthUpdateController.changePassword
);

// Delete account permanently
router.delete(
   "/delete-account",
   authMiddleware,
   AuthUpdateController.deleteAccount
);

// Upload new avatar image (multipart/form-data with key = avatar)
router.post(
   "/update-avatar",
   authMiddleware,
   upload.single("avatar"), // 👈 must match form field name
   AuthUpdateController.uploadAvatarFile
);

// Upload new background image (multipart/form-data with key = background)
router.post(
   "/update-background",
   authMiddleware,
   upload.single("bgcover"),
   AuthUpdateController.uploadBackgroundFile
);

module.exports = router;
