import { io } from "socket.io-client";
import SimplePeer from "simple-peer";
import { useRef, useEffect, useState } from "react";

const socket = io("http://localhost:3001");

export default function ChatWithCall() {
  const peerRef = useRef(null);
  const [incoming, setIncoming] = useState(null); // lưu thông tin người đang gọi

  useEffect(() => {
    // Khi có cuộc gọi đến
    socket.on("incoming-call", ({ from, offer }) => {
      console.log("Incoming call from:", from);
      setIncoming({ from, offer }); // lưu lại để hiển thị popup chẳng hạn
    });

    // Khi cuộc gọi được trả lời
    socket.on("call-answered", ({ answer }) => {
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
    };
  }, []);

  // --- Hàm người nhận trả lời ---
  const handleAnswerCall = () => {
    const { from, offer } = incoming;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const peer = new SimplePeer({ initiator: false, trickle: false, stream });
        peerRef.current = peer;

        // Nhận offer từ người gọi
        peer.signal(offer);

        // Khi có answer (phản hồi của mình) → gửi về server
        peer.on("signal", data => {
          socket.emit("answer-call", { to: from, answer: data });
        });

        // Khi có âm thanh từ người kia
        peer.on("stream", remoteStream => {
          const audioEl = document.getElementById("remoteAudio");
          if (audioEl) audioEl.srcObject = remoteStream;
        });
      });
  };

  const handleCallUser = (remoteId) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const peer = new SimplePeer({ initiator: true, trickle: false, stream });
        peerRef.current = peer;

        peer.on("signal", data => {
          socket.emit("call-user", { to: remoteId, offer: data });
        });

        peer.on("stream", remoteStream => {
          const audioEl = document.getElementById("remoteAudio");
          if (audioEl) audioEl.srcObject = remoteStream;
        });
      });
  };

  return (
    <div className="p-4">
      <button
        className="p-2 bg-blue-500 text-white rounded"
        onClick={() => handleCallUser(prompt("Nhập socket ID người cần gọi:"))}
      >
        📞 Gọi
      </button>

      {incoming && (
        <div className="mt-4 bg-yellow-100 p-3 rounded">
          <p>📲 Có cuộc gọi đến từ: {incoming.from}</p>
          <button
            className="bg-green-500 text-white p-2 rounded mt-2"
            onClick={handleAnswerCall}
          >
            ✅ Trả lời
          </button>
        </div>
      )}

      <audio id="remoteAudio" autoPlay controls />
    </div>
  );
}
