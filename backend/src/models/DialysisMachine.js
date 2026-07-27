import mongoose from "mongoose";

const dialysisMachineSchema = new mongoose.Schema(
  {
    model: { type: String },
    serialNumber: { type: String },
    status: {
      type: String,
      enum: ["online", "offline", "maintenance"],
      default: "online",
    },
    location: { type: String },
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    totalSessions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dialysisMachineSchema.index({ status: 1 });
dialysisMachineSchema.index({ serialNumber: 1 });

const DialysisMachine = mongoose.model(
  "DialysisMachine",
  dialysisMachineSchema
);
export default DialysisMachine;
