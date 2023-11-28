import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const NewArrivalSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: [true, "Please provide a Cover."],
  },
  name: {
    type: String,
    required: [true, "Please provide a Full Name."],
  },
  code: {
    type: String,
  },
  sku: {
    type: String,
  },
  price: {
    type: Number,
  },
  priceSale: {
    type: Number,
  },
  totalRating: {
    type: Number,
  },
  totalReview: {
    type: Number,
  },
  status: {
    type: String,
  },
  inventoryType: {
    type: String,
  },
  available: {
    type: Number,
  },
  description: {
    type: String,
  },
  sold: {
    type: Number,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  category: {
    type: String,
  },
  gender: {
    type: String,
  },
  images: {
    type: Array,
  },
  tags: {
    type: Array,
  },
  colors: {
    type: Array,
  },
  sizes: {
    type: Array,
  },
});

export default mongoose.models.NewArrival ||
  mongoose.model("NewArrival", NewArrivalSchema);
