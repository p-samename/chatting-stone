import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("message", (msg) => {
        socket.broadcast.emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    console.log("Socket.IO server started");
  } else {
    console.log("Socket.IO server already running");
  }
  res.end();
}
