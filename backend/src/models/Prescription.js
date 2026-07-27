import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    rxNumber: {
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
    encounterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Encounter",
    },
    date: { type: Date, default: Date.now },
    medications: [
      {
        name: { type: String },
        genericName: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
        route: { type: String },
        dispensed: { type: Boolean, default: false },
        dispensedQty: { type: Number },
        instructions: { type: String },
      },
    ],
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "verified", "dispensed", "partial", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ status: 1 });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
