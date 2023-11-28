import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    subTotal: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },

    status: {
      type: String,
    },
    orderNo: {
      type: String,
    },
    items: {
      type: Array,
    },
    amcsItems: {
      type: Array,
    },
    user: {
      type: Object,
      required: [true, "Size is missing!"],
    },
    deliveryPartner: {
      type: String,
      default: "",
    },
    ordertrackingNumber: {
      type: String,
      default: "",
    },
    gst: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
