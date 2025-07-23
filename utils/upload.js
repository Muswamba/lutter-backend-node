const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/"); // Save files in /uploads directory
   },
   filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase(); // Extract file extension
      const uniqueName = `${Date.now()}-${Math.round(
         Math.random() * 1e9
      )}${ext}`;
      cb(null, uniqueName); // Assign unique name to avoid filename collisions
   },
});

// File filter to only accept image types
const fileFilter = (req, file, cb) => {
   if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept file
   } else {
      cb(new Error("Only image files are allowed!"), false); // Reject non-image file
   }
};

// Max file size: 2MB (optional)
const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
   },
});

module.exports = upload;
