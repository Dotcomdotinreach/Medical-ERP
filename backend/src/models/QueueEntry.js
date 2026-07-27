import mongoose from "mongoose";

const queueEntrySchema = new mongoose.Schema(
  {
    token: {
      type: Number,
      required: true,
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
    dept: { type: String },
    state: {
      type: String,
      enum: ["Waiting", "Called", "In Consultation", "Completed", "Skipped"],
      default: "Waiting",
    },
    priority: {
      type: String,
      enum: ["Normal", "High", "Urgent"],
      default: "Normal",
    },
    waitMins: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

queueEntrySchema.index({ date: 1 });
queueEntrySchema.index({ state: 1 });
queueEntrySchema.index({ dept: 1 });
queueEntrySchema.index({ patientId: 1 });

const QueueEntry = mongoose.model("QueueEntry", queueEntrySchema);
export default QueueEntry;
