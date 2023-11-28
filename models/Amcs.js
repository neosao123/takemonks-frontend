import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */
import Product from "../models/Products";
const AmcScema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: Object,
      required: false,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    durationType: {
      type: String,
      required: true,
      enum: ["monthly", "yearly"],
    },
    durationCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Amcs || mongoose.model("Amcs", AmcScema);
