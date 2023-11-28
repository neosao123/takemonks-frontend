import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const SubCategorySchema = new mongoose.Schema(
  {
    cover: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    totalItems: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SubCategory ||
  mongoose.model("SubCategory", SubCategorySchema);
