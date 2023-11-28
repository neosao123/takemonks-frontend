import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const BrandScema = new mongoose.Schema(
    {
        cover: {
            type: Object,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Brand ||
    mongoose.model("Brand", BrandScema);
