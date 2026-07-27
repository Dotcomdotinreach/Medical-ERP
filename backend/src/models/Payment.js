import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking", "insurance", "corporate"],
      required: true,
    },
    reference: { type: String },
    date: { type: Date, default: Date.now },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed", "refunded"],
      default: "completed",
    },
  },
  { timestamps: true }
);

paymentSchema.index({ invoiceId: 1 });
paymentSchema.index({ date: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
