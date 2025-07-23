const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
   {
      path: { type: String }, // e.g., "/uploads/filename.jpg"
      description: { type: String }, // optional alt text or caption
      size: { type: String }, // e.g., "1.4MB"
      mimeType: { type: String }, // e.g., "image/jpeg"
   },
   { _id: true, timestamps: true } // include timestamps for createdAt and updatedAt
);

module.exports = ImageSchema;
