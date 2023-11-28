import mongoose from "mongoose";

const CommanSettingSchema = new mongoose.Schema(
  {
    settingId: {
      type: String,
      required: true,
    },
    settingName: {
      type: String,
    },
    settingValue: {
      type: String,
    },
  },
  { timestamps: true }
);
const CommanSetting =
  mongoose.models.CommanSetting ||
  mongoose.model("CommanSetting", CommanSettingSchema);

export default CommanSetting;
