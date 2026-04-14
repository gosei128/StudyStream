require("dotenv").config();
const express = require("express");
const app = express();

const { z } = require("zod");
const { Server } = require("socket.io");
const server = require("http").createServer(app);

async function main() {
  const frontendOrigin = process.env.FRONTEND_ORIGIN;

  const io = new Server(server, {
    cors: {
      origin: frontendOrigin,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomName) => {
      const parsed = z
        .string()
        .trim()
        .min(1, "roomName is required")
        .max(64, "roomName too long")
        .safeParse(roomName);

      if (!parsed.success) {
        socket.emit("error", { message: parsed.error.issues[0]?.message });
        return;
      }

      socket.join(parsed.data);
      console.log("user joins the room");

      socket.to(parsed.data).emit("message", {
        roomName: parsed.data,
        text: `user joins ${parsed.data}`,
        at: new Date().toISOString(),
      });
    });

    socket.on("sendMessage", (payload) => {
      const schema = z.object({
        roomName: z.string().trim().min(1).max(64),
        text: z.string().trim().min(1, "message is empty").max(500),
      });

      const parsed = schema.safeParse(payload);
      if (!parsed.success) {
        socket.emit("error", { message: parsed.error.issues[0]?.message });
        return;
      }

      io.to(parsed.data.roomName).emit("message", {
        roomName: parsed.data.roomName,
        text: parsed.data.text,
        at: new Date().toISOString(),
      });
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT: ${process.env.PORT}`);
  });
}

main();
