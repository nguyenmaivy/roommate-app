"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { filterRooms } from "@/app/chat/page-ai";
import Link from "next/link";

export default function RoomChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  // ✅ Load lịch sử chat
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          isBot: true,
          type: "text",
          content:
            "👋 Xin chào! Tôi là chatbot hỗ trợ tìm phòng trọ. Bạn có thể hỏi tôi về phòng trọ theo ngân sách, khu vực, số người ở...",
        },
      ]);
    }
  }, []);

  // ✅ Lưu lịch sử chat
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const searchRoomsWithAI = async (query) => {
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const filters = await res.json();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
      const roomsData = (await response.json()).rooms;
      const results = filterRooms(filters, roomsData);

      setIsTyping(false);
      return results;
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      return [];
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      isBot: false,
      type: "text",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const results = await searchRoomsWithAI(input.trim());

    if (!results || results.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          isBot: true,
          type: "text",
          content: "❌ Không tìm thấy phòng phù hợp.",
        },
      ]);
      return;
    }

    const botMessage = {
      isBot: true,
      type: "rooms",
      rooms: results,
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const clearChat = () => {
    localStorage.removeItem("chat_history");
    setMessages([
      {
        isBot: true,
        type: "text",
        content:
          "👋 Xin chào! Tôi là chatbot hỗ trợ tìm phòng trọ. Bạn có thể hỏi tôi về phòng trọ theo ngân sách, khu vực, số người ở...",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-indigo-500 text-white flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Chatbot Tìm Phòng</h3>
          
        </div>
        {/* <button
          onClick={clearChat}
          className="text-sm bg-white text-indigo-600 px-3 py-1 rounded"
        >
          Xóa chat
        </button> */}
        
        
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.isBot
                  ? "bg-white border border-gray-200"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {/* ✅ TEXT */}
              {msg.type === "text" && msg.content}

              {/* ✅ ROOM RESULT */}
              {msg.type === "rooms" &&
                msg.rooms.map((room, i) => (
                  <div key={i} className="border-t pt-2 mt-2">
                    <p>🏠 {room.title}</p>
                    <p>📍 {room.address}</p>
                    <p>💰 {room.price.toLocaleString()} đ/tháng</p>
                    <p>📐 {room.area} m²</p>
                    <p>🏷 {room.rental_type}</p>

                    <Link
                      href={`/room/${room.id}`}
                      className="text-indigo-500 underline"
                    >
                      Xem chi tiết
                    </Link>

                    <p className="mt-1">
                      ✨ Tiện ích:{" "}
                      {room.amenities.length > 0
                        ? room.amenities.join(", ")
                        : "Không có"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-xl border text-sm animate-pulse">
              Đang tìm kiếm...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-full"
            placeholder="Nhập câu hỏi..."
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
