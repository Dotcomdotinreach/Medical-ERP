import mongoose from "mongoose";

const bloodUnitSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Whole Blood",
        "Packed RBC",
        "Plasma",
        "Platelet",
        "Cryoprecipitate",
      ],
    },
    volume: { type: Number },
    collectionDate: { type: Date },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ["available", "reserved", "issued", "expired", "discarded"],
      default: "available",
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
    component: { type: String },
    batchNo: { type: String },
  },
  { timestamps: true }
);

bloodUnitSchema.index({ bloodGroup: 1 });
bloodUnitSchema.index({ status: 1 });
bloodUnitSchema.index({ expiryDate: 1 });

const BloodUnit = mongoose.model("BloodUnit", bloodUnitSchema);
export default BloodUnit;
