const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => console.log("✅ Connected to MongoDB"))
   .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

// Basic health check route
app.get("/", (req, res) => {
   res.send("✅ Backend is running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
// command: npm run dev -- --host
app.listen(PORT, "0.0.0.0", () => {
   // Open the server URL in the default browser
   console.log(
      `🚀 Server is running on port ${PORT} , full URL: http://192.168.100.2:${PORT} open on browser: alt + click`
   );
});
