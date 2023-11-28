import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const NewCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewCategory",
    },
  },
  { timestamps: true }
);

export default mongoose.models.NewCategory ||
  mongoose.model("NewCategory", NewCategorySchema);
