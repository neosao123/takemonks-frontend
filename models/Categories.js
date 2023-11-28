import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const CategorySchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
