// app/chat/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Search, Phone, Video, MoreVertical, ArrowLeft, Home } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useUser } from '../Store/UserContext';
import SimplePeer from "simple-peer";
import { socket } from '../socket';
import { playSound, stopSound } from './soundPlayer';
export default function ChatPage() {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const peerRef = useRef(null);
  const bottomRef = useRef(null);
  const [incoming, setIncoming] = useState(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [ringtone, setRingtone] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
          method: "GET",
          credentials: "include",
        }); // gọi API
        const data = await res.json();

        // convert lastTime về Date để format HH:mm được
        const parsed = data.map(chat => ({
          ...chat,
          lastTime: new Date(chat.lastTime),
        }));

        setChats(parsed);
      } catch (error) {
        console.error("Lỗi khi tải danh sách chat:", error);
      }
    }

    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();
    socket.emit("joinRoom", selectedChat.roomId);
    const handleNewMessage = (message) => {
      if (message.roomId !== selectedChat.roomId) return;
      setMessages(prev => [
        ...prev,
        {
          id: message.messageId,
          text: message.text,
          sender: message.sender,
          time: new Date(message.createdAt),
          isOwn: message.sender === user.id,
        }
      ]);

    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [selectedChat]);

  async function fetchMessages() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${selectedChat.roomId}`, {
        credentials: "include",
      });

      const data = (await res.json()).messages;

      setMessages(
        data.map(msg => ({
          id: msg.messageId,
          text: msg.text,
          sender: msg.senderId,
          time: new Date(msg.createdAt),
          isOwn: msg.senderId === user.id,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn:", error);
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const messageData = {
      roomId: selectedChat.roomId,
      sender: user.id,
      receiver: selectedChat.otherUserId,
      text: newMessage.trim(),
    };

    socket.emit("sendMessage", messageData);
    setNewMessage('');
  };

  const handleCallUser = (targetUserId) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              {
                urls: "turn:relay1.expressturn.com:3478",
                username: "efree",
                credential: "efree",
              },
            ],
          },
        });

        setRemoteUserId(targetUserId);
        peerRef.current = peer;
        setCallStatus("ringing");
        setShowPopup(true);

        const audio = playSound("/sounds/ringing.mp3", true);
        setRingtone(audio);

        peer.on("signal", data => {
          socket.emit("call-user", { to: targetUserId, offer: data });
        });

        peer.on("stream", remoteStream => {
          const audioEl = document.getElementById("remoteAudio");
          if (audioEl) {
            audioEl.srcObject = remoteStream;
            audioEl.play().catch(err => console.error("⚠️ Audio play failed:", err));
          }
        });
      });
  };


  //thiết lập sự kiện cho cuộc gọi đến và trả lời cuộc gọi
  useEffect(() => {
    socket.on("incoming-call", ({ from, offer }) => {
      console.log("📲 Incoming call from:", from);
      setIncoming({ from, offer });
      setRemoteUserId(from);
      setShowPopup(true);
      setCallStatus("ringing");

      const audio = playSound("/sounds/incoming.mp3", true);
      setRingtone(audio);
    });

    return () => socket.off("incoming-call");
  }, []);

  const handleAnswerCall = () => {
    const { from, offer } = incoming;
    stopSound(ringtone); // dừng chuông
    setIncoming(null);
    setCallStatus("connected");
    setShowPopup(true);

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            {
              urls: "turn:relay1.expressturn.com:3478",
              username: "efree",
              credential: "efree",
            },
          ],
        },
      });

      peerRef.current = peer;
      peer.signal(offer);

      peer.on("signal", data => {
        socket.emit("answer-call", { to: from, answer: data });
      });

      peer.on("stream", remoteStream => {
        const audioEl = document.getElementById("remoteAudio");
        if (audioEl) {
          audioEl.srcObject = remoteStream;
          audioEl.play().catch(err => console.error("⚠️ Audio play failed:", err));
        }
      });
    });
  };

  const handleRejectCall = () => {
    const { from } = incoming;
    socket.emit("reject-call", { to: from });
    stopSound(ringtone);
    setIncoming(null);
    setCallStatus("ended");
    setShowPopup(false);
    playSound("/sounds/rejected.mp3");
  };


  //gán sự kiện khi cuộc gọi bị từ chối
  // useEffect(() => {
  //   socket.on("call-rejected", () => {
  //     stopSound(ringtone);
  //     console.log("📴 Cuộc gọi bị từ chối");
  //     alert("Người nhận đã từ chối cuộc gọi");
  //     if (peerRef.current) peerRef.current.destroy(); // hủy peer connection
  //     setCallStatus("ended");
  //   });

  //   return () => socket.off("call-rejected");
  // }, []);

  const handleEndCall = () => {
    if (!remoteUserId) return;
    console.log("📴 Kết thúc cuộc gọi với:", remoteUserId);

    socket.emit("end-call", { to: remoteUserId });
    stopSound(ringtone);
    playSound("/sounds/end.mp3");
    setCallStatus("ended");
    setShowPopup(false);

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  };

  useEffect(() => {
    socket.on("call-answered", ({ answer }) => {
      if (peerRef.current) peerRef.current.signal(answer);
      stopSound(ringtone);
      setCallStatus("connected");
      setShowPopup(true);
    });

    socket.on("call-rejected", () => {
      stopSound(ringtone);
      playSound("/sounds/rejected.mp3");
      setCallStatus("ended");
      setShowPopup(false);
      if (peerRef.current) peerRef.current.destroy();
    });

    socket.on("call-ended", () => {
      stopSound(ringtone);
      playSound("/sounds/end.mp3");
      setCallStatus("ended");
      setShowPopup(false);
      if (peerRef.current) peerRef.current.destroy();
    });

    return () => {
      socket.off("call-answered");
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [ringtone]);


  const filteredChats = chats.filter(chat => chat.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="flex h-[calc(100dvh-70px)] bg-gray-100 overflow-hidden">
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
                    {chat?.title?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 truncate">{chat.title}</h3>
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
                  {selectedChat.title.charAt(0)}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.roomTitle}</h2>
                  <p className="text-xs text-green-600">Đang hoạt động</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  onClick={() => handleCallUser(selectedChat.otherUserId)}
                >
                  <Phone className="w-5 h-5"
                  />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* {incoming && (
                  <div className="mt-4 bg-yellow-100 p-3 rounded">
                    <p>📲 Có cuộc gọi đến từ: {incoming.from}</p>
                    <button
                      className="bg-green-500 text-white p-2 rounded mt-2"
                      onClick={handleAnswerCall}
                    >
                      ✅ Trả lời
                    </button>
                  </div>
                )} */}
                <audio id="remoteAudio" autoPlay controls className='hidden' />
              </div>
            </div>

            {/* Tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.isOwn ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {format(msg.time, 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
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
      {showPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-50">
          {callStatus === "ringing" && incoming ? (
            <>
              <p className="text-xl mb-4">📲 Có cuộc gọi đến!</p>
              <div className="flex gap-4">
                <button onClick={handleAnswerCall} className="bg-green-500 px-5 py-2 rounded-lg">Chấp nhận</button>
                <button onClick={handleRejectCall} className="bg-red-500 px-5 py-2 rounded-lg">Từ chối</button>
              </div>
            </>
          ) : callStatus === "ringing" ? (
            <>
              <p className="text-xl mb-4">📞 Đang gọi...</p>
              <button onClick={handleEndCall} className="bg-red-500 px-5 py-2 rounded-lg">Hủy cuộc gọi</button>
            </>
          ) : callStatus === "connected" ? (
            <>
              <p className="text-xl mb-4">🔊 Đang trò chuyện</p>
              <button onClick={handleEndCall} className="bg-red-500 px-5 py-2 rounded-lg">Kết thúc</button>
            </>
          ) : null}
        </div>
      )}
      {/* {callStatus === "connected" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <span>🔊 Đang trò chuyện</span>
          <button
            onClick={handleEndCall}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
          >
            Kết thúc
          </button>
        </div>
      )} */}
      <audio src="/sounds/ringing.mp3" preload="auto" className='hidden' />
      <audio src="/sounds/end.mp3" preload="auto" className='hidden' />
      <audio src="/sounds/incoming.mp3" preload="auto" className='hidden' />
      <audio src="/sounds/rejected.mp3" preload="auto" className='hidden' />
    </div>
  );
}