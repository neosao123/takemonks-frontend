import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */
import Orders from "./Orders";
import Amcs from "./Amcs";

const OrderSchema1 = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Orders,
    },
    amcId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Amcs,
    },
    duration: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    serialKey: {
      type: String,
      default: "",
    },
    amcExpriry: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      default: "N/A",
    },
    appliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.OrderwithAmcs ||
  mongoose.model("OrderwithAmcs", OrderSchema1);
