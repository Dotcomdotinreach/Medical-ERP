import mongoose from "mongoose";

const encounterSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    visitDate: { type: Date, default: Date.now },
    vitals: {
      heartRate: { type: Number },
      bpSystolic: { type: Number },
      bpDiastolic: { type: Number },
      temperature: { type: Number },
      respRate: { type: Number },
      spo2: { type: Number },
      weight: { type: Number },
      height: { type: Number },
    },
    symptoms: [{ type: String }],
    diagnosis: [{ type: String }],
    notes: { type: String },
    prescriptions: [
      {
        name: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
        route: { type: String },
        dispensed: { type: Boolean },
      },
    ],
    orders: [
      {
        type: { type: String },
        description: { type: String },
        status: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["in-progress", "completed", "cancelled"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

encounterSchema.index({ patientId: 1 });
encounterSchema.index({ doctorId: 1 });
encounterSchema.index({ visitDate: 1 });
encounterSchema.index({ status: 1 });

const Encounter = mongoose.model("Encounter", encounterSchema);
export default Encounter;
