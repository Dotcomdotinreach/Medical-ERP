import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    time: { type: String },
    type: {
      type: String,
      enum: ["In-Person", "Video", "Phone", "Chat"],
      default: "In-Person",
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "checked-in",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },
    notes: { type: String },
    reason: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
