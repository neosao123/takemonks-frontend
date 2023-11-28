import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const HomeSliderSchema = new mongoose.Schema(
  {
    cover: {
      type: Object,
      required: true,
    },
    heading: {
      type: String,
    },
    description: {
      type: String,
    },
    enabled: {
      type: Boolean,
    },
    btnPrimary: {
      type: Object,
    },
    btnSecondary: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HomeSlider ||
  mongoose.model("HomeSlider", HomeSliderSchema);
