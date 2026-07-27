import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CORS_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userRole = decoded.role;
      } catch (e) {
        socket.disconnect();
        return;
      }
    }

    console.log(`Client connected: ${socket.id}`);

    // Join rooms
    socket.on("queue:join", (dept) => {
      socket.join(`queue:${dept}`);
    });

    socket.on("vitals:subscribe", (patientId) => {
      socket.join(`vitals:${patientId}`);
    });

    socket.on("dispatch:track", (dispatchId) => {
      socket.join(`dispatch:${dispatchId}`);
    });

    socket.on("notification:subscribe", (userId) => {
      socket.join(`notifications:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => io;

// Emit helpers
export const emitQueueUpdate = (dept, data) => {
  io?.to(`queue:${dept}`).emit("queue:updated", data);
};

export const emitVitalsUpdate = (patientId, data) => {
  io?.to(`vitals:${patientId}`).emit("vitals:live", data);
};

export const emitDispatchUpdate = (dispatchId, data) => {
  io?.to(`dispatch:${dispatchId}`).emit("dispatch:location", data);
};

export const emitNotification = (userId, data) => {
  io?.to(`notifications:${userId}`).emit("notification:new", data);
};

export const emitAlert = (data) => {
  io?.emit("alert:new", data);
};
