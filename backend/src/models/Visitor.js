import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: { type: String },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    relation: { type: String },
    badgeNumber: { type: String },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    status: {
      type: String,
      enum: ["checked-in", "checked-out"],
      default: "checked-in",
    },
  },
  { timestamps: true }
);

visitorSchema.index({ patientId: 1 });
visitorSchema.index({ status: 1 });
visitorSchema.index({ checkInTime: 1 });

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
