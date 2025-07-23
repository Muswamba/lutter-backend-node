const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

const baseURL = process.env.FRONTEND_URL || "http://localhost:5173";
const resetTokens = new Map(); // In-memory store for password reset tokens

const AuthController = {
   // ✅ Register a new user
   async register(req, res) {
      const { name, email, password, role, deviceInfo } = req.body;
      try {
         const existingUser = await User.findOne({ email });
         if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
         }

         const user = new User({
            name,
            email,
            password,
            role,
            deviceInfo: deviceInfo
               ? [
                    {
                       deviceId: deviceInfo.deviceId,
                       os: deviceInfo.os,
                       model: deviceInfo.model,
                       brand: deviceInfo.brand,
                       manufacturer: deviceInfo.manufacturer,
                       lastLogin: new Date(),
                    },
                 ]
               : [],
         });

         const savedUser = await user.save();

         const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
         );
         const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
         );

         res.status(201).json({
            message: "Registration successful",
            accessToken,
            refreshToken,
            user: {
               id: user._id,
               name: user.name,
               email: user.email,
               avatar: user.avatar,
               backgroundImage: user.backgroundImage,
               role: user.role,
            },
         });
      } catch (error) {
         console.error("Register Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Login existing user
   async login(req, res) {
      const { email, password, deviceInfo } = req.body;

      console.log("Info received:");

      try {
         const user = await User.findOne({ email });
         if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
         }

         // Handle deviceInfo
         if (deviceInfo) {
            const existingDevice = user.deviceInfo.find(
               (d) => d.deviceId === deviceInfo.deviceId
            );

            if (existingDevice) {
               existingDevice.lastLogin = new Date();
            } else {
               user.deviceInfo.push({
                  deviceId: deviceInfo.deviceId,
                  os: deviceInfo.os,
                  model: deviceInfo.model,
                  brand: deviceInfo.brand,
                  manufacturer: deviceInfo.manufacturer,
                  lastLogin: new Date(),
               });
            }

            await user.save(); // <== Important!
         }

         const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
         );

         const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
         );

         res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
               id: user._id,
               name: user.name,
               email: user.email,
               avatar: user.avatar,
               backgroundImage: user.backgroundImage,
               role: user.role,
            },
         });
      } catch (error) {
         console.error("Login Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Forgot Password - send reset link
   async forgotPassword(req, res) {
      const { email } = req.body;

      try {
         const user = await User.findOne({ email });
         if (!user) return res.status(404).json({ message: "User not found" });
         const resetToken = crypto.randomBytes(32).toString("hex");
         resetTokens.set(resetToken, user._id); // store in-memory (use DB in production)

         const resetLink = `${baseURL}/reset-password/${resetToken}`;
         const html = `<p>Click to reset your password:</p><a href="${resetLink}">Reset Password</a>`;
         await sendMail(user.email, "Password Reset", html);

         res.status(200).json({
            message: "Reset link sent",
            resetLink,
            resetToken,
         });
      } catch (error) {
         console.error("Forgot Password Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Reset Password
   async resetPassword(req, res) {
      const { token } = req.params;
      const { password } = req.body;
      console.log("Reset Password Token:", token);
      try {
         const userId = resetTokens.get(token);
         if (!userId) {
            return res
               .status(400)
               .json({ message: "Invalid or expired token" });
         }

         const user = await User.findById(userId);
         if (!user) return res.status(404).json({ message: "User not found" });

         user.password = password;
         await user.save();
         resetTokens.delete(token); // remove used token

         res.status(200).json({ message: "Password reset successful" });
      } catch (error) {
         console.error("Reset Password Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Get logged-in user's profile
   async getProfile(req, res) {
      try {
         const userId = req.user.userId || req.user._id;
         const user = await User.findById(userId).select("-password");
         if (!user) return res.status(404).json({ message: "User not found" });

         const responseData = {
            user,
            notifications: null,
            messages: null,
            friends: null,
            settings: null,
         };

         res.status(200).json(responseData);
      } catch (error) {
         console.error("Profile Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },

   // ✅ Refresh Access Token
   async refreshToken(req, res) {
      const { refreshToken } = req.body;

      try {
         if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
         }

         const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
         );
         const user = await User.findById(decoded.userId);

         if (!user) return res.status(404).json({ message: "User not found" });

         const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
         );

         res.status(200).json({ accessToken: newAccessToken });
      } catch (error) {
         console.error("Refresh Token Error:", error);
         res.status(403).json({ message: "Invalid or expired refresh token" });
      }
   },
   // update profile/account data
   async updateProfile(req, res) {
      try {
         const user = await User.findById(req.user.userId);
         if (!user) return res.status(404).json({ message: "User not found" });
         user.name = req.body.name || user.name;
         user.email = req.body.email || user.email;
         user.avatar = req.body.avatar || user.avatar;
         user.backgroundImage =
            req.body.backgroundImage || user.backgroundImage;
         await user.save();
         res.status(200).json({ message: "Profile updated successfully" });
      } catch (error) {
         console.error("Update Profile Error:", error);
         res.status(500).json({ message: "Internal server error" });
      }
   },
};

module.exports = AuthController;
