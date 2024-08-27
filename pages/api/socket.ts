import { Server } from "socket.io";

export default function handler(req, res) {
  // 이미 소켓 서버가 설정되어 있는지 확인
  if (res.socket.server.io) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  // 소켓 서버 초기화
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("New client connected");

    // 메시지 이벤트 리스너 등록
    socket.on("message", (msg) => {
      console.log("Message received:", msg);
      socket.broadcast.emit("message", msg); // 모든 클라이언트에게 메시지 전송
    });

    // 클라이언트가 연결 해제될 때 정리 작업
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  console.log("Setting up Socket.io");
  res.end();
}
