// -----------------------------
// Imports & Initial Setup
// -----------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs"); // 👈 Add this

// Load environment variables
dotenv.config();

// -----------------------------
// Ensure Uploads Directory Exists 👇
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
   fs.mkdirSync(uploadsDir, { recursive: true });
}

// -----------------------------
// Routes
// -----------------------------
const authRoutes = require("./routes/authRoutes");
const authProfileRoutes = require("./routes/authProfile");
const notificationRoutes = require("./routes/notificationRoutes");

// -----------------------------
// App Initialization
// -----------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// Middleware
// -----------------------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir)); // ✅ serve images

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/profile", authProfileRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
   res.send("✅ Backend is running!");
});

// -----------------------------
// MongoDB Connection
// -----------------------------
mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => {
      console.log("✅ Connected to MongoDB");
      app.listen(PORT, "0.0.0.0", () => {
         console.log(`🚀 Server running at http://192.168.100.2:${PORT}`);
      });
   })
   .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
   });
