import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const HomeBannersSchema = new mongoose.Schema(
  {
    bannerAfterSlider1: {
      type: Object,
      required: true,
    },
    bannerAfterSlider2: {
      type: Object,
      required: true,
    },
    bannerAfterSlider3: {
      type: Object,
      required: true,
    },
    centeredBanner: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HomeBanners ||
  mongoose.model("HomeBanners", HomeBannersSchema);
