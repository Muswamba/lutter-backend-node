const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ImageSchema = require("./Image"); // ✅ Include it

const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: "user" },

      avatar: ImageSchema, // ✅ Embedded Image model
      backgroundImage: ImageSchema,

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
   { timestamps: true }
);

// ✅ Password hashing
userSchema.pre("save", async function (next) {
   if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
   }
   next();
});

// ✅ Clean JSON output
userSchema.method("toJSON", function () {
   const { _id, __v, password, ...object } = this.toObject();
   object.id = _id;
   return object;
});

module.exports = mongoose.model("User", userSchema);
