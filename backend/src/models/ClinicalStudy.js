import mongoose from "mongoose";

const clinicalStudySchema = new mongoose.Schema(
  {
    title: { type: String },
    protocolNumber: { type: String },
    phase: {
      type: String,
      enum: ["Phase I", "Phase II", "Phase III", "Phase IV"],
    },
    status: {
      type: String,
      enum: ["recruiting", "active", "completed", "suspended", "terminated"],
    },
    sponsor: { type: String },
    principalInvestigator: { type: String },
    startDate: { type: Date },
    targetEnrollment: { type: Number },
    enrolled: { type: Number, default: 0 },
    sites: [{ type: String }],
  },
  { timestamps: true }
);

clinicalStudySchema.index({ protocolNumber: 1 });
clinicalStudySchema.index({ status: 1 });

const ClinicalStudy = mongoose.model("ClinicalStudy", clinicalStudySchema);
export default ClinicalStudy;
