import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
