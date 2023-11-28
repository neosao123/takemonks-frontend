import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const ChildCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChildCategory ||
  mongoose.model("ChildCategory", ChildCategorySchema);
