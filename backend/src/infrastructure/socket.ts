import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { corsOrigin } from "../config";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join-showtime", (showTimeId: string) => {
      socket.join(`showtime:${showTimeId}`);
      console.log(`Socket ${socket.id} joined room showtime:${showTimeId}`);
    });

    socket.on("leave-showtime", (showTimeId: string) => {
      socket.leave(`showtime:${showTimeId}`);
      console.log(`Socket ${socket.id} left room showtime:${showTimeId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io is not initialized yet!");
  }
  return io;
};

export const broadcastSeatStatus = (
  showTimeId: string,
  seatIds: string[],
  status: "RESERVED" | "AVAILABLE" | "HOLD",
): void => {
  if (!io) return;
  io.to(`showtime:${showTimeId}`).emit("seats-updated", {
    showTimeId,
    seatIds,
    status,
  });
};
