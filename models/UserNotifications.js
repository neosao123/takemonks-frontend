import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const UserNotificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
});

export default mongoose.models.UserNotification ||
  mongoose.model("UserNotification", UserNotificationSchema);
