import path from "path";
import { fileURLToPath } from "url";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

export const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "No file uploaded", 400);

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      url: `${req.protocol}://${req.get("host")}/api/upload/${req.file.filename}`,
    };

    sendSuccess(res, fileData, "File uploaded", 201);
  } catch (error) {
    next(error);
  }
};

export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, "No files uploaded", 400);
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
      url: `${req.protocol}://${req.get("host")}/api/upload/${file.filename}`,
    }));

    sendSuccess(res, { files, count: files.length }, "Files uploaded", 201);
  } catch (error) {
    next(error);
  }
};

export const serveFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, filename);

    const safePath = path.resolve(filePath);
    if (!safePath.startsWith(path.resolve(UPLOAD_DIR))) {
      return sendError(res, "Invalid file path", 400);
    }

    res.sendFile(safePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          return sendError(res, "File not found", 404);
        }
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};
