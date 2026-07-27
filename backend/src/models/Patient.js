import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    uhid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    first: { type: String, trim: true },
    last: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dob: { type: Date },
    age: { type: Number },
    blood: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    phone: { type: String },
    email: { type: String, lowercase: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    aadhaar: { type: String },
    insurance: { type: String },
    emergencyContact: { type: String },
    emergencyRelation: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "deceased"],
      default: "active",
    },
    allergies: [{ type: String }],
    conditions: [{ type: String }],
    lastVisit: { type: Date },
  },
  { timestamps: true }
);

patientSchema.index({ name: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ status: 1 });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
