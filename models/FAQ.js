import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const BrandScema = new mongoose.Schema(
  {
    qustion: {
      type: String,
      required: false,
    },
    customerName: {
      type: String,
      required: true,
    },
    ans: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FAQ || mongoose.model("FAQ", FAQScema);
