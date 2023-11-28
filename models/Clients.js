import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cover: { type: Object },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    // select: false,
  },
  gender: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  otp: {
    type: String,
    default: "",
  },
});

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
