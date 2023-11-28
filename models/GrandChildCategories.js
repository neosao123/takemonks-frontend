import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const GrandChildCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChildCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.GrandChildCategory ||
  mongoose.model("GrandChildCategory", GrandChildCategorySchema);
