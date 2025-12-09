import { v4 as uuidv4 } from "uuid";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

let ddb;
export const __setDocumentClient = (client) => { ddb = client; };

export const initChatRealtime = (io) => {
  if (!io) throw new Error("Socket.IO server instance required");

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Tham gia room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Nhận tin nhắn mới từ client
    socket.on("sendMessage", async (data) => {
      const { roomId, sender, receiver, text } = data;
      if (!roomId || !sender || !receiver || !text) {
        socket.emit("errorMessage", { error: "Missing required fields" });
        return;
      }

      const messageId = uuidv4();
      const createdAt = Date.now();
      const messageItem = { messageId, roomId, sender, receiver, text, createdAt };

      // Lưu vào DynamoDB
      try {
        await ddb.send(new PutCommand({ TableName: "Messages", Item: messageItem }));
      } catch (err) {
        console.error("❌ Lỗi lưu tin nhắn:", err.message);
        socket.emit("errorMessage", { error: "Cannot save message" });
        return;
      }

      // Broadcast tin nhắn đến tất cả client trong room
      io.to(roomId).emit("newMessage", messageItem);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
