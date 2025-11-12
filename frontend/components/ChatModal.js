"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { MessageSquare, X } from "lucide-react";
import { useUser } from "@/app/Store/UserContext";

// Kết nối socket 1 lần (singleton)
const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  transports: ["websocket"],
});

export default function ChatModal({ room, onClose }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!room?.roomId) return;

    console.log(`📌 Joining room: ${room.roomId}`);
    socket.emit("joinRoom", room.roomId);

    // ✅ Fetch lịch sử chat từ backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${room.roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages.map(msg => ({
          ...msg,
          isOwn: msg.senderId === user.id,
        })) || []);
      })
      .catch((err) => console.error("❌ Fetch messages error:", err));

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, {
        ...message,
        isOwn: message.sender == user.id,
      }]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [room.roomId]);

  // ✅ Gửi tin nhắn
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      roomId: room.roomId,
      sender: room.studentId,    
      receiver: room.landlordId,
      text: input.trim(),
    };

    socket.emit("sendMessage", messageData);
    setInput("");
  };
  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-end z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm h-full max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="p-4 border-b bg-indigo-500 text-white rounded-t-xl flex justify-between items-center">
          <h3 className="font-bold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            {room.roomTitle || "Phòng chat"}
          </h3>
          <button onClick={onClose} className="hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.messageId || msg.createdAt}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${msg.isOwn
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition"
            >
              ➤
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
