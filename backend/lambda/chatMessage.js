// backend/chat/chatService.js

import { v4 as uuidv4 } from "uuid";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

let ddb;

/** 🔧 Inject DynamoDBDocumentClient từ local-server.js */
export const __setDocumentClient = (client) => {
  ddb = client;
};

/**
 * ✅ Hàm khởi tạo Socket.IO và xử lý realtime chat
 */
export const initChatRealtime = (io) => {
  if (!io) throw new Error("Socket.IO server instance required");

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Tham gia room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`✅ User ${socket.id} joined room ${roomId}`);
    });

    // Nhận tin nhắn từ client gửi lên
    socket.on("sendMessage", async (data) => {
      const { roomId, sender, receiver, text } = data;
      if (!roomId || !sender || !receiver || !text) {
        socket.emit("errorMessage", { error: "Missing required fields" });
        return;
      }

      const messageId = uuidv4();
      const createdAt = Date.now();

      const messageItem = {
        messageId,
        roomId,
        sender,
        receiver,
        text,
        createdAt,
      };

      try {
        await ddb.send(
          new PutCommand({
            TableName: "Messages",
            Item: messageItem,
          })
        );

        // ✅ Gửi message realtime tới room tương ứng
        io.to(roomId).emit("newMessage", messageItem);
      } catch (err) {
        console.error("❌ Lỗi lưu tin nhắn:", err.message);
        socket.emit("errorMessage", { error: "Cannot save message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

/**
 * ✅ API lấy danh sách tin nhắn theo roomId
 */
export const getMessages = async (event) => {
  const roomId = event?.params?.roomId || event?.pathParameters?.roomId;

  if (!roomId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "roomId is required" }),
    };
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: "Messages",
        KeyConditionExpression: "roomId = :roomId",
        ExpressionAttributeValues: { ":roomId": roomId },
        ScanIndexForward: true, // sort ASC theo createdAt
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ messages: result.Items }),
    };
  } catch (err) {
    console.error("❌ Error Query messages:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
