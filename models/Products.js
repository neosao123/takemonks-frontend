import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const ProductSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceSale: {
    type: Number,
    required: true,
  },
  totalRating: {
    type: Number,
    required: true,
  },
  totalReview: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
  },
  inventoryType: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: false,
  },
  available: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
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
  condition: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  salesPackage: {
    type: String,
    required: true
  },
  highlightOne: {
    type: String,
    default: ""
  },
  highlightTwo: {
    type: String,
    default: ""
  },
  highlightThree: {
    type: String,
    default: ""
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
