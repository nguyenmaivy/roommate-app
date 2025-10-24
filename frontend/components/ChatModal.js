'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function ChatModal({ room, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Chào ${room.landlordId}! Tôi muốn hỏi về phòng ${room.title || room.address}. Phòng còn trống không ạ?`, sender: 'Student' },
    { id: 2, text: `Chào bạn! Phòng này hiện tại còn trống. Bạn muốn đến xem phòng lúc nào?`, sender: 'Landlord' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Thay thế bằng API gửi tin nhắn (DynamoDB + Thông báo qua n8n)
      setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'Student' }]);
      setInput('');
    }
  };

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
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'Student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                msg.sender === 'Student'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <p className="text-xs text-center text-gray-400 mt-2 italic">Mô phỏng thông báo tin nhắn mới.</p>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
