import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: { type: Date, default: Date.now },
    dept: { type: String },
    doctor: { type: String },
    items: [
      {
        description: { type: String },
        quantity: { type: Number },
        rate: { type: Number },
        amount: { type: Number },
        category: { type: String },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    paid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue", "cancelled"],
      default: "pending",
    },
    insuranceClaimed: { type: Boolean, default: false },
    insuranceAmount: { type: Number },
    mode: { type: String },
  },
  { timestamps: true }
);

invoiceSchema.index({ patientId: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ date: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
