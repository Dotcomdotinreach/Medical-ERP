import mongoose from "mongoose";
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  bloodGroup: { type: String, enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
  phone: String,
  lastDonation: Date,
  donations: { type: Number, default: 0 },
  status: { type: String, enum: ["active","inactive","deferred"], default: "active" }
}, { timestamps: true });
export default mongoose.models.Donor || mongoose.model("Donor", donorSchema);
