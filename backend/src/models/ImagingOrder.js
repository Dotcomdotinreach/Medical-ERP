import mongoose from "mongoose";

const imagingOrderSchema = new mongoose.Schema(
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
    examType: { type: String },
    bodyPart: { type: String },
    clinicalHistory: { type: String },
    priority: {
      type: String,
      enum: ["Normal", "Urgent", "STAT"],
      default: "Normal",
    },
    status: {
      type: String,
      enum: [
        "ordered",
        "scheduled",
        "checked-in",
        "acquiring",
        "uploaded",
        "reporting",
        "signed",
        "delivered",
      ],
      default: "ordered",
    },
    orderDate: { type: Date, default: Date.now },
    scheduledDate: { type: Date },
    room: { type: String },
    radiologist: { type: String },
    findings: { type: String },
    impression: { type: String },
    aiFindings: [
      {
        finding: { type: String },
        confidence: { type: Number },
      },
    ],
    signedBy: { type: String },
    signedAt: { type: Date },
  },
  { timestamps: true }
);

imagingOrderSchema.index({ patientId: 1 });
imagingOrderSchema.index({ status: 1 });
imagingOrderSchema.index({ orderDate: 1 });

const ImagingOrder = mongoose.model("ImagingOrder", imagingOrderSchema);
export default ImagingOrder;
