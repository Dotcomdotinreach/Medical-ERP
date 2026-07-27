import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dept: {
      type: String,
      required: true,
    },
    qualification: { type: String },
    fee: { type: Number, default: 500 },
    room: { type: String },
    available: { type: Boolean, default: true },
    schedule: [
      {
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        slots: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

doctorSchema.index({ userId: 1 });
doctorSchema.index({ dept: 1 });
doctorSchema.index({ available: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
