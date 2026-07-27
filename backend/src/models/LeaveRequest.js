import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      enum: ["Casual", "Sick", "Earned", "Maternity", "Paternity", "Unpaid"],
    },
    startDate: { type: Date },
    endDate: { type: Date },
    days: { type: Number },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

leaveRequestSchema.index({ employeeId: 1 });
leaveRequestSchema.index({ status: 1 });

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
