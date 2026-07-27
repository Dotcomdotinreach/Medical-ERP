import mongoose from "mongoose";

const stockItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: { type: String },
    sku: { type: String, unique: true, trim: true },
    manufacturer: { type: String },
    batchNo: { type: String },
    expiry: { type: Date },
    mrp: { type: Number },
    stockQty: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    location: { type: String },
    unit: { type: String, default: "pcs" },
    supplier: { type: String },
    status: {
      type: String,
      enum: ["active", "low-stock", "out-of-stock", "expired", "quarantined"],
      default: "active",
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

stockItemSchema.index({ name: 1 });
stockItemSchema.index({ status: 1 });
stockItemSchema.index({ category: 1 });

const StockItem = mongoose.model("StockItem", stockItemSchema);
export default StockItem;
