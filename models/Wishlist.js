import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    wishlist: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);
