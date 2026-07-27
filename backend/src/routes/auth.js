import { Router } from "express";
import { register, login, refreshToken, logout, getMe, forgotPassword, resetPassword, updateProfile, changePassword } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/authValidator.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", validate(refreshTokenSchema), refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
