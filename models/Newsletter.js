import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
});

export default mongoose.models.Newsletter ||
  mongoose.model("Newsletter", NewsletterSchema);
