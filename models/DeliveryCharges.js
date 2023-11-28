import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */
const DeliveryChargesSchema = new mongoose.Schema({
  deliveryCharges: {
    type: Number,
    default: 200,
    required: [true, "Please provide deliveryCharges"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.DeliveryCharges || mongoose.model("DeliveryCharges", DeliveryChargesSchema);
