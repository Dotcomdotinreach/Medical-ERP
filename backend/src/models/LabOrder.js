import mongoose from "mongoose";

const labOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    tests: [
      {
        name: { type: String },
        category: { type: String },
        status: { type: String },
      },
    ],
    status: {
      type: String,
      enum: [
        "ordered",
        "collected",
        "received",
        "analyzing",
        "verified",
        "reported",
        "delivered",
      ],
      default: "ordered",
    },
    priority: {
      type: String,
      enum: ["Normal", "High", "STAT"],
      default: "Normal",
    },
    orderDate: { type: Date, default: Date.now },
    collectedAt: { type: Date },
    completedAt: { type: Date },
    results: [
      {
        testName: { type: String },
        value: { type: String },
        unit: { type: String },
        referenceRange: { type: String },
        flag: { type: String },
        status: { type: String },
      },
    ],
    notes: { type: String },
  },
  { timestamps: true }
);

labOrderSchema.index({ patientId: 1 });
labOrderSchema.index({ status: 1 });
labOrderSchema.index({ orderDate: 1 });

const LabOrder = mongoose.model("LabOrder", labOrderSchema);
export default LabOrder;
