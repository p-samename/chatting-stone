import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("message", (msg) => {
      console.log("Message received: " + msg);
      socket.broadcast.emit("message", msg);
    });
  });

  console.log("Setting up Socket.io");
  res.end();
}
