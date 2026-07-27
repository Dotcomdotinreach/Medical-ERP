import mongoose from "mongoose";

const dispatchSchema = new mongoose.Schema(
  {
    emergencyType: { type: String },
    callerName: { type: String },
    callerPhone: { type: String },
    location: { type: String },
    priority: {
      type: String,
      enum: ["Normal", "High", "Critical"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "dispatched",
        "en-route",
        "arrived",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    assignedAmbulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
    },
    assignedDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

dispatchSchema.index({ status: 1 });
dispatchSchema.index({ priority: 1 });
dispatchSchema.index({ createdAt: 1 });

const Dispatch = mongoose.model("Dispatch", dispatchSchema);
export default Dispatch;
