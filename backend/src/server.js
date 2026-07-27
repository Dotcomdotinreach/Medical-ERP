import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
initSocket(server);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});
