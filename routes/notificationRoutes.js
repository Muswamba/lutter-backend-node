const express = require("express");
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", verifyToken, notificationController.getNotifications);

// Mark a specific notification as read
router.put("/:id/read", verifyToken, notificationController.markAsRead);

// Mark all notifications as read for the authenticated user
router.put("/read-all", verifyToken, notificationController.markAllAsRead);

// Create a new notification (optional, used by backend or admin)
router.post("/", verifyToken, notificationController.createNotification);

module.exports = router;
