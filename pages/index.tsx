import { useEffect, useState } from "react";
import io from "socket.io-client";

// 소켓 인스턴스를 클라이언트 외부에 정의하여 재사용
let socket;
const user = new Date();
export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Socket.IO 클라이언트 초기화
    socketInitializer();

    // 컴포넌트 언마운트 시 클린업
    return () => {
      if (socket) {
        socket.off("message");
        socket.disconnect(); // 소켓 연결 종료
      }
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) {
      await fetch("/api/socket");
      socket = io();

      // 메시지 리스너 등록
      socket.on("message", (msg) => {
        console.log("Message received:", msg); // 디버깅용
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
  };

  const sendMessage = () => {
    console.log(message);
    if (socket && message.trim()) {
      // 자신의 메시지를 화면에 즉시 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: user },
      ]);

      // 서버로 메시지 전송
      console.log("Sending message:", message); // 디버깅용
      socket.emit("message", { text: message, sender: user });
      setMessage("");
    }
  };

  return (
    <div className="p-[20px]">
      <h1 className="font-bold">실시간 채팅</h1>
      <div
        className="p-4 mt-4 h-[500px] rounded-md"
        style={{
          border: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <ul className="flex flex-col gap-[8px]">
          {messages.map((msg, index) => (
            <li
              className={`p-[4px_8px] bg-zinc-500 rounded-lg w-max ${
                msg.sender === user ? "ml-auto" : "mr-auto"
              }`}
              key={index}
            >
              {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center h-[50px] my-[12px]">
        <input
          className="pl-[20px] text-black text-[14px] focus:none rounded-l-md w-full"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메세지를 입력해주세요."
        />
        <button
          className="text-[14px] w-[100px] bg-slate-400 rounded-r-md"
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
}
