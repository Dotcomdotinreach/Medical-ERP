import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
    },
    dept: { type: String },
    diagnosis: { type: String },
    admitDate: { type: Date, default: Date.now },
    dischargeDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "active", "discharged", "transferred"],
      default: "pending",
    },
    insurance: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

admissionSchema.index({ patientId: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ admitDate: 1 });
admissionSchema.index({ bedId: 1 });

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
