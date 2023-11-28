import mongoose from "mongoose";
import Products from "./Products";

const ProductSerialKey = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Products,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    productSerialNo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ProductSerialKey ||
  mongoose.model("ProductSerialKey", ProductSerialKey);
