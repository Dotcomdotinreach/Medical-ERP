import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: { type: String },
    department: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true },
    joinDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "on-leave", "terminated"],
      default: "active",
    },
    salary: { type: Number },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
    },
    qualifications: [{ type: String }],
    certifications: [{ type: String }],
  },
  { timestamps: true }
);

employeeSchema.index({ userId: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
