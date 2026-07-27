import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    wardId: { type: String },
    ward: { type: String },
    number: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ICU", "General", "Semi-Private", "Private", "Deluxe"],
    },
    state: {
      type: String,
      enum: ["available", "occupied", "reserved", "cleaning", "maintenance"],
      default: "available",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { timestamps: true }
);

bedSchema.index({ state: 1 });
bedSchema.index({ ward: 1 });
bedSchema.index({ type: 1 });

const Bed = mongoose.model("Bed", bedSchema);
export default Bed;
