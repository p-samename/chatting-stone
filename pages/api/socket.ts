import { Server } from "socket.io";
import { UserId } from "../types";

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

  // 연결된 사용자의 별명을 저장할 객체
  const userNicknames = {};

  io.on("connection", (socket) => {
    console.log("hello !" + socket.id);

    // 클라이언트에서 별명 설정
    socket.on("setNickname", (nickname) => {
      userNicknames[socket.id] = nickname;

      socket.broadcast.emit("message", {
        text: `${nickname} 님이 입장하셨습니다.`,
        sender: nickname,
      });
    });

    // 메시지 이벤트 리스너 등록
    socket.on("message", (msg) => {
      const nickname = userNicknames[socket.id];
      console.log("Message received from " + nickname + ":", msg);

      socket.broadcast.emit("message", {
        text: msg,
        sender: nickname,
      });
    });

    // 클라이언트가 연결 해제될 때 정리 작업
    socket.on("disconnect", () => {
      const nickname = userNicknames[socket.id];
      console.log("Client disconnected :" + nickname);

      socket.broadcast.emit("message", {
        text: `${nickname} 님이 퇴장하셨습니다.`,
        sender: nickname,
      });

      // 사용자 정보 삭제
      delete userNicknames[socket.id];
    });
  });

  console.log("Setting up Socket.io");
  res.end();
}
