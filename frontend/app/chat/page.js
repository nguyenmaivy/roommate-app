// app/chat/page.js
'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Send, Search, Phone, Video, MoreVertical, ArrowLeft, User, Home } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { USER_ROLES } from '@/mockData';

const MOCK_CHATS = [
  {
    id: 'chat1',
    roomId: 'r1',
    roomTitle: 'Phòng trọ mới Quận 1',
    otherUser: { id: 'L1', name: 'Trần Văn B (Chủ trọ)', role: USER_ROLES.LANDLORD },
    lastMessage: 'Có sẵn phòng không ạ?',
    lastTime: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
  },
  {
    id: 'chat2',
    roomId: 'r3',
    roomTitle: 'Căn hộ mini Full nội thất',
    otherUser: { id: 'L1', name: 'Trần Văn B (Chủ trọ)', role: USER_ROLES.LANDLORD },
    lastMessage: 'Em muốn xem phòng vào thứ 7 được không?',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
  },
  {
    id: 'chat3',
    roomId: 'r2',
    roomTitle: 'Studio giá rẻ gần ĐH Sài Gòn',
    otherUser: { id: 'L2', name: 'Lê Thị C (Chủ trọ)', role: USER_ROLES.LANDLORD },
    lastMessage: 'Dạ còn phòng ạ',
    lastTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 1,
  },
];

const MOCK_MESSAGES = {
  chat1: [
    { id: 'm1', senderId: 'U1', text: 'Chào anh, phòng còn không ạ?', time: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 'm2', senderId: 'L1', text: 'Còn em ơi, anh gửi hình thêm nhé', time: new Date(Date.now() - 1000 * 60 * 25) },
    { id: 'm3', senderId: 'U1', text: 'Dạ anh gửi giúp em với ạ', time: new Date(Date.now() - 1000 * 60 * 20) },
    { id: 'm4', senderId: 'L1', text: 'Có sẵn phòng không ạ?', time: new Date(Date.now() - 1000 * 60 * 5), isOwn: true },
  ],
  chat2: [
    { id: 'm5', senderId: 'U1', text: 'Chị ơi em muốn xem phòng vào thứ 7 được không?', time: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    { id: 'm6', senderId: 'L1', text: 'Được em, chị ở đó cả ngày', time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  ],
};

export default function ChatPage() {
  const [user] = useState({ id: 'U1', name: 'Nguyễn Văn A', role: USER_ROLES.STUDENT });
  const [chats, setChats] = useState(MOCK_CHATS);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // New refs
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const shouldScrollRef = useRef(false);

  // load messages when selecting chat
  useEffect(() => {
    if (selectedChat) {
      setMessages(MOCK_MESSAGES[selectedChat.id] ? [...MOCK_MESSAGES[selectedChat.id]] : []);
      // request a scroll after messages are rendered
      shouldScrollRef.current = true;
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // when messages change we will do scroll in useLayoutEffect for reliability
  useLayoutEffect(() => {
    if (!shouldScrollRef.current) return;

    const container = messagesContainerRef.current;
    const end = messagesEndRef.current;

    if (!container) {
      shouldScrollRef.current = false;
      return;
    }

    const doScroll = (behavior = 'auto') => {
      try {
        // primary: scroll container to bottom
        container.scrollTo({ top: container.scrollHeight, behavior });
        // fallback: scroll the end marker into view
        if (end) end.scrollIntoView({ behavior, block: 'end' });
      } catch (e) {
        container.scrollTop = container.scrollHeight;
      } finally {
        shouldScrollRef.current = false;
      }
    };

    // Give one frame for DOM layout (helps with fonts/images)
    requestAnimationFrame(() => {
      // tiny delay to ensure child layout finished
      setTimeout(() => doScroll('smooth'), 20);
    });
  }, [messages, selectedChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const msg = {
      id: `m${Date.now()}`,
      senderId: user.id,
      text: newMessage,
      time: new Date(),
      isOwn: true,
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    // request auto-scroll after sending
    shouldScrollRef.current = true;

    // update last message in chats
    setChats(prev =>
      prev.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: newMessage, lastTime: new Date(), unread: 0 }
          : chat
      )
    );
  };

  const filteredChats = chats.filter(chat =>
    chat.roomTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Danh sách cuộc trò chuyện - Trái */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} md:w-96 flex-col bg-white border-r border-gray-200`}>
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-800">Tin nhắn</h1>
            <Link href="/" className="text-gray-500 hover:text-indigo-600">
              <Home className="w-5 h-5" />
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tin nhắn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
                }}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition ${selectedChat?.id === chat.id ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {chat.otherUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 truncate">{chat.roomTitle}</h3>
                      <span className="text-xs text-gray-500 ml-2">
                        {format(chat.lastTime, 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>Không có tin nhắn nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Khung chat - Phải */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {selectedChat ? (
          <>
            {/* Header chat */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden text-gray-600 hover:text-indigo-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedChat.otherUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.roomTitle}</h2>
                  <p className="text-xs text-green-600">Đang hoạt động</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === user.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {format(msg.time, 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input gửi tin nhắn */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Màn hình trống khi chưa chọn chat */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl mb-4" />
            <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
            <p className="text-sm mt-2">Nhắn tin với chủ trọ ngay!</p>
          </div>
        )}
      </div>
    </div>
  );
}
