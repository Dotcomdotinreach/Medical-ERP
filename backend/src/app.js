import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import queueRoutes from "./routes/queue.js";
import encounterRoutes from "./routes/encounters.js";
import bedRoutes from "./routes/beds.js";
import admissionRoutes from "./routes/admissions.js";
import labRoutes from "./routes/lab.js";
import radiologyRoutes from "./routes/radiology.js";
import pharmacyRoutes from "./routes/pharmacy.js";
import billingRoutes from "./routes/billing.js";
import inventoryRoutes from "./routes/inventory.js";
import nurseRoutes from "./routes/nurse.js";
import ipdRoutes from "./routes/ipd.js";
import hrmsRoutes from "./routes/hrms.js";
import otRoutes from "./routes/ot.js";
import icuRoutes from "./routes/icu.js";
import bloodBankRoutes from "./routes/bloodBank.js";
import dialysisRoutes from "./routes/dialysis.js";
import maternityRoutes from "./routes/maternity.js";
import pediatricsRoutes from "./routes/pediatrics.js";
import oncologyRoutes from "./routes/oncology.js";
import telemedicineRoutes from "./routes/telemedicine.js";
import cdssRoutes from "./routes/cdss.js";
import aiRoutes from "./routes/ai.js";
import researchRoutes from "./routes/research.js";
import interopRoutes from "./routes/interop.js";
import cssdRoutes from "./routes/cssd.js";
import adminRoutes from "./routes/admin.js";
import superAdminRoutes from "./routes/superAdmin.js";
import emergencyRoutes from "./routes/emergency.js";
import portalRoutes from "./routes/portal.js";
import ambulanceRoutes from "./routes/ambulance.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

// Security & parsing
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[HTTP] ${req.method} ${req.url} - Origin: ${req.headers.origin} -> Status: ${res.statusCode}`);
  });
  next();
});
app.use(helmet());
console.log("CORS_ORIGIN loaded from env:", process.env.CORS_ORIGIN);
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin === process.env.CORS_ORIGIN
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api/", generalLimiter);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/encounters", encounterRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/radiology", radiologyRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/nurse", nurseRoutes);
app.use("/api/ipd", ipdRoutes);
app.use("/api/hrms", hrmsRoutes);
app.use("/api/ot", otRoutes);
app.use("/api/icu", icuRoutes);
app.use("/api/blood-bank", bloodBankRoutes);
app.use("/api/dialysis", dialysisRoutes);
app.use("/api/maternity", maternityRoutes);
app.use("/api/pediatrics", pediatricsRoutes);
app.use("/api/oncology", oncologyRoutes);
app.use("/api/telemedicine", telemedicineRoutes);
app.use("/api/cdss", cdssRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/interop", interopRoutes);
app.use("/api/cssd", cssdRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/upload", uploadRoutes);

// Error handler
app.use(errorHandler);

export default app;
