import mongoose from "mongoose";

const surgerySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    surgeonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    anesthesiologistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    procedure: { type: String },
    type: {
      type: String,
      enum: ["Elective", "Emergency", "Urgent"],
    },
    date: { type: Date },
    time: { type: String },
    room: { type: String },
    status: {
      type: String,
      enum: [
        "scheduled",
        "pre-op",
        "in-progress",
        "completed",
        "post-op",
        "cancelled",
      ],
      default: "scheduled",
    },
    duration: { type: Number },
    department: { type: String },
    cost: { type: Number },
    notes: { type: String },
    complications: [{ type: String }],
  },
  { timestamps: true }
);

surgerySchema.index({ patientId: 1 });
surgerySchema.index({ status: 1 });
surgerySchema.index({ date: 1 });
surgerySchema.index({ surgeonId: 1 });

const Surgery = mongoose.model("Surgery", surgerySchema);
export default Surgery;
