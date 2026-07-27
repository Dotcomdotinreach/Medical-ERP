import { Router } from "express";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", (req, res) => {
  res.json({ success: true, message: "Super Admin endpoint - implement full CRUD" });
});

export default router;
