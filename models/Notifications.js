import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const NotificationsSchema = new mongoose.Schema({
  opened: {
    type: Boolean,
  },
  title: {
    type: String,
  },
  orderId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  city: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
});

export default mongoose.models.Notifications ||
  mongoose.model("Notifications", NotificationsSchema);
