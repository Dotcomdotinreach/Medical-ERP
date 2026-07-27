import mongoose from "mongoose";
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  license: String,
  status: { type: String, enum: ["available","on-trip","off-duty"], default: "available" },
  experience: Number,
  rating: { type: Number, default: 5 }
}, { timestamps: true });
export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
