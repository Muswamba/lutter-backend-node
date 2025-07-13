const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   title: {
      // Optionally store the sender's name directly
      type: String,
      required: false,
   },
   message: {
      type: String,
      required: true,
   },
   imageUrl: {
      // Optional image, can be taken from user.profileImage
      type: String,
      required: false,
   },
   read: {
      type: Boolean,
      default: false,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

notificationSchema.index({ user: 1, createdAt: -1 });
// Customize toJSON output to use `id` instead of `_id`
notificationSchema.method("toJSON", function () {
   const { _id, __v, ...object } = this.toObject();
   object.id = _id;
   return object;
});

module.exports = mongoose.model("Notification", notificationSchema);
