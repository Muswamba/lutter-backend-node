const Notification = require("../models/notification");

// Create a notificationController
const notificationController = {
   // Get all notifications for a user (most recent first)
   async getNotifications(req, res) {
      try {
         const userId = req.user.id || req.user.userId; // Assuming user is authenticated via middleware

         // Check if user already has notifications
         let notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();
         // Only insert sample notifications if none exist
         if (!notifications.length) {
            const samples = [
               {
                  user: userId,
                  title: "Claudia Alves",
                  message: "Commented on your post.",
                  imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
               },
               {
                  user: userId,
                  title: "Kimberly Nguyen",
                  message: "Started following you.",
                  imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
               },
               {
                  user: userId,
                  title: "Mark Johnson",
                  message: "Liked your post.",
                  imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
               },
               {
                  user: userId,
                  title: "John Doe",
                  message: "Started following you.",
                  imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
               },
               {
                  user: userId,
                  title: "Jane Smith",
                  message: "Commented on your post.",
                  imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
               },
               {
                  user: userId,
                  title: "Bob Johnson",
                  message: "Started following you.",
                  imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
               },
               {
                  user: userId,
                  title: "Alice Brown",
                  message: "Liked your post.",
                  imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
               },
            ];
            await Notification.insertMany(samples);
            // console.log("✅ Sample notifications inserted.");

            // Re-fetch after insert to return them
            notifications = await Notification.find({ user: userId })
               .sort({ createdAt: -1 })
               .exec();
         }

         res.status(200).json(notifications); // Return all an array
      } catch (err) {
         res.status(500).json({
            message: "Failed to get notifications",
            error: err.message,
         });
      }
   },

   // Mark a single notification as read
   async markAsRead(req, res) {
      try {
         const { id } = req.params;
         const notification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
         );

         if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
         }

         res.status(200).json({
            message: "Notification marked as read",
            notification,
         });
      } catch (err) {
         res.status(500).json({
            message: "Failed to update notification",
            error: err.message,
         });
      }
   },

   // Mark all notifications for a user as read
   async markAllAsRead(req, res) {
      try {
         const userId = req.user.id;
         await Notification.updateMany(
            { user: userId, read: false },
            { read: true }
         );

         res.status(200).json({ message: "All notifications marked as read" });
      } catch (err) {
         res.status(500).json({
            message: "Failed to mark all as read",
            error: err.message,
         });
      }
   },

   // Create a new notification
   async createNotification(req, res) {
      try {
         const { user, title, message, imageUrl } = req.body;

         if (!user || !message) {
            return res
               .status(400)
               .json({ message: "User and message are required" });
         }

         const notification = new Notification({
            user,
            title,
            message,
            imageUrl,
         });

         await notification.save();

         res.status(201).json({
            message: "Notification created",
            notification,
         });
      } catch (err) {
         res.status(500).json({
            message: "Failed to create notification",
            error: err.message,
         });
      }
   },
};

// Export the notificationController
module.exports = notificationController;
