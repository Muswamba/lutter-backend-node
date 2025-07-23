const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const AuthUpdateController = {
   // ✅ Update profile fields (name, avatar, backgroundImage as embedded image objects)
   async updateProfile(req, res) {
      try {
         const user = await User.findById(req.user.userId);
         if (!user) return res.status(404).json({ message: "User not found" });

         const { name } = req.body;

         if (name) user.name = name;
         //   Add more fields as needed
         await user.save();

         res.status(200).json({
            message: "Profile updated successfully",
            user: {
               id: user._id,
               name: user.name,
               email: user.email,
               avatar: user.avatar,
               backgroundImage: user.backgroundImage,
               // Include other fields you want to return
            },
         });
      } catch (error) {
         console.error("Update Profile Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Change password securely
   async changePassword(req, res) {
      const { oldPassword, newPassword } = req.body;
      try {
         const user = await User.findById(req.user.userId);
         if (!user) return res.status(404).json({ message: "User not found" });

         const isMatch = await user.comparePassword(oldPassword);
         if (!isMatch)
            return res
               .status(400)
               .json({ message: "Incorrect current password" });

         user.password = newPassword;
         await user.save();

         res.status(200).json({ message: "Password updated successfully" });
      } catch (error) {
         console.error("Change Password Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Delete user account
   async deleteAccount(req, res) {
      try {
         await User.findByIdAndDelete(req.user.userId);
         res.status(200).json({ message: "Account deleted successfully" });
      } catch (error) {
         console.error("Delete Account Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Upload new avatar (with image metadata)
   async uploadAvatarFile(req, res) {
      if (!req.file) {
         return res.status(400).json({ message: "Avatar image is required" });
      }

      try {
         const user = await User.findById(req.user.userId);
         if (!user) return res.status(404).json({ message: "User not found" });

         // Delete old avatar file if it exists
         if (user.avatar?.path) {
            const oldAvatarPath = path.join(__dirname, "..", user.avatar.path);
            if (fs.existsSync(oldAvatarPath)) {
               fs.unlinkSync(oldAvatarPath);
            }
         }

         user.avatar = {
            path: `/uploads/${req.file.filename}`,
            size: `${(req.file.size / (1024 * 1024)).toFixed(2)}MB`,
            mimeType: req.file.mimetype,
            description: req.body.description || "", // optional
         };

         await user.save();

         console.log("Avatar updated:", user);
         res.status(200).json({
            message: "Avatar updated",
            avatar: user.avatar,
         });
      } catch (error) {
         console.error("Upload Avatar Error:", error);
         res.status(500).json({ message: "Failed to update avatar" });
      }
   },

   // ✅ Upload new background image (with image metadata)
   async uploadBackgroundFile(req, res) {
      if (!req.file) {
         return res
            .status(400)
            .json({ message: "Background image is required" });
      }

      try {
         const user = await User.findById(req.user.userId);
         if (!user) return res.status(404).json({ message: "User not found" });

         // Delete old background image file if it exists
         if (user.backgroundImage?.path) {
            const oldPath = path.join(
               __dirname,
               "..",
               user.backgroundImage.path
            );
            if (fs.existsSync(oldPath)) {
               fs.unlinkSync(oldPath);
            }
         }

         user.backgroundImage = {
            path: `/uploads/${req.file.filename}`,
            size: `${(req.file.size / (1024 * 1024)).toFixed(2)}MB`,
            mimeType: req.file.mimetype,
            description: req.body.description || "",
         };

         await user.save();

         res.status(200).json({
            message: "Background image updated",
            backgroundImage: user.backgroundImage,
         });
      } catch (error) {
         console.error("Upload Background Error:", error);
         res.status(500).json({ message: "Failed to update background" });
      }
   },
};

module.exports = AuthUpdateController;
