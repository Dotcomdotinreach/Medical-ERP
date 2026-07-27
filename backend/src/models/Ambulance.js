import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String },
    type: {
      type: String,
      enum: ["ALS", "BLS", "Patient Transport"],
    },
    status: {
      type: String,
      enum: ["available", "dispatched", "maintenance"],
      default: "available",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    currentLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [{ type: Number }],
    },
  },
  { timestamps: true }
);

ambulanceSchema.index({ status: 1 });
ambulanceSchema.index({ registrationNumber: 1 });
ambulanceSchema.index({ "currentLocation": "2dsphere" });

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
export default Ambulance;
