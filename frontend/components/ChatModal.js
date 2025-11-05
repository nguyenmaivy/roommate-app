"use client"

import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { MessageSquare, X } from "lucide-react"

export default function ChatModal({ room, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Tự động scroll xuống tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Kết nối Socket.IO
    socketRef.current = io("http://localhost:3001") // URL backend Socket.IO

    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id)
      socket.emit("joinRoom", room.roomId)
    })

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
      scrollToBottom()
    })

    socket.on("errorMessage", (err) => {
      console.error("Socket error:", err)
    })

    // Cleanup khi đóng modal
    return () => {
      socket.disconnect()
    }
  }, [room.roomId])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const messageData = {
      roomId: room.roomId,
      sender: "Student", // Tùy chỉnh theo user login
      receiver: room.landlordId,
      text: input.trim(),
    }

    // Gửi tin nhắn tới server
    socketRef.current.emit("sendMessage", messageData)

    // Hiển thị tạm ở frontend (optimistic UI)
    setMessages((prev) => [
      ...prev,
      { ...messageData, messageId: Date.now(), createdAt: Date.now() },
    ])

    setInput("")
    scrollToBottom()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm h-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b bg-indigo-500 text-white rounded-t-xl flex justify-between items-center">
          <h3 className="font-bold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" /> Chat với {room.landlordId}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Khu vực Tin nhắn */}
        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.messageId || msg.id}
              className={`flex ${msg.sender === "Student" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "Student"
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Form gửi Tin nhắn */}
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
              <span className="sr-only">Gửi</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
