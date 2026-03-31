require("dotenv").config();
const express = require("express");
const app = express();

const { Server } = require("socket.io");
const server = require("http").createServer(app);

await function main() {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomName) => {
      socket.join(roomName);
      console.log("user joins the room");

      socket.to(roomName).emit("message", `user joins ${roomName}`);
    });
  });
};

main();
