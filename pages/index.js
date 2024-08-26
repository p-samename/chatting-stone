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
    <div>
      <h1>Socket.IO Chat</h1>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === user ? "right" : "left",
              padding: "5px",
              margin: "5px",
              borderRadius: "5px",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        style={{ width: "80%", padding: "10px", margin: "10px 0" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
        Send
      </button>
    </div>
  );
}
