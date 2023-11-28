import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const ReviewSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  ratings: {
    type: Array,
  },
  reviews: {
    type: Array,
  },
  createdAt: {
    type: Number,
  },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
