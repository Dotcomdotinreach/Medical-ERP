import mongoose from "mongoose";

const icuBedSchema = new mongoose.Schema(
  {
    number: { type: String },
    type: {
      type: String,
      enum: ["Medical", "Surgical", "Cardiac", "Neuro", "Burn"],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    onVentilator: { type: Boolean, default: false },
    assignedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { timestamps: true }
);

icuBedSchema.index({ status: 1 });
icuBedSchema.index({ type: 1 });

const ICUBed = mongoose.model("ICUBed", icuBedSchema);
export default ICUBed;
