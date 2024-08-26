import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  };

  const sendMessage = () => {
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div>
      <h1>Socket.IO Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
