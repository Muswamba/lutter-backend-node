const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: "user" }, // Optional role field
      avatar: { type: String }, // You can enhance this later
      backgroundImage: { type: String },
      // device info
      deviceInfo: [
         {
            deviceId: String,
            os: String,
            model: String,
            brand: String,
            manufacturer: String,
            lastLogin: Date,
         },
      ],
   },
   { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Hash password before save
userSchema.pre("save", async function (next) {
   if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
   }
   next();
});

// Customize toJSON output to use `id` instead of `_id`
userSchema.method("toJSON", function () {
   const { _id, __v, password, ...object } = this.toObject();
   object.id = _id;
   return object;
});

module.exports = mongoose.model("User", userSchema);
