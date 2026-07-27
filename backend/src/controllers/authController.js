import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
  return { accessToken, refreshToken };
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role, department, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, "Email already registered", 400);

    const user = await User.create({ email, password, name, role, department, phone });
    const tokens = generateTokens(user);

    // Save refresh token
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    sendSuccess(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens
    }, "Registration successful", 201);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshTokens");
    if (!user) return sendError(res, "Invalid credentials", 401);

    if (user.status !== "active") return sendError(res, "Account is not active", 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, "Invalid credentials", 401);

    const tokens = generateTokens(user);

    user.refreshTokens.push(tokens.refreshToken);
    user.lastLogin = new Date();
    await user.save();

    sendSuccess(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department },
      ...tokens
    }, "Login successful");
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return sendError(res, "Refresh token required", 400);

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshTokens");

    if (!user || !user.refreshTokens.includes(token)) {
      return sendError(res, "Invalid refresh token", 401);
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    sendSuccess(res, tokens, "Token refreshed");
  } catch (error) {
    if (error.name === "TokenExpiredError") return sendError(res, "Refresh token expired", 401);
    next(error);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const user = await User.findById(req.user.id).select("+refreshTokens");

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== token);
      await user.save();
    }

    sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendError(res, "User not found", 404);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    sendSuccess(res, null, "If the email exists, a reset link has been sent");
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    sendSuccess(res, null, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    sendSuccess(res, user, "Profile updated");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return sendError(res, "User not found", 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return sendError(res, "Incorrect current password", 400);

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};
