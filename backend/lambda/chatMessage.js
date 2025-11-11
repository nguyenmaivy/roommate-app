// backend/chat/chatService.js

import { v4 as uuidv4 } from "uuid";
import { PutCommand, QueryCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

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
        roomTitle: data.roomTitle,
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
  const roomId =
    event?.params?.roomId ||
    event?.pathParameters?.roomId ||
    event?.queryStringParameters?.roomId;

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
        ScanIndexForward: true, // sort theo createdAt ASC (tin nhắn cũ -> mới)
      })
    );

    // ✅ Chuẩn hóa output cho frontend (senderId, receiverId, time, messageId)
    const formatted = result.Items.map((msg) => ({
      id: msg.messageId,
      messageId: msg.messageId,
      text: msg.text,
      roomId: msg.roomId,
      senderId: msg.sender,     // 👈 chính xác người gửi
      receiverId: msg.receiver, // 👈 chính xác người nhận
      createdAt: msg.createdAt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ messages: formatted }),
    };
  } catch (err) {
    console.error("❌ Error Query messages:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export const getUserChats = async (email) => {
  if (!email) throw new Error("email required");

  const userResult = await ddb.send(
    new GetCommand({
      TableName: "Users",
      Key: { email },
    })
  );

  if (!userResult.Item) throw new Error("User not found");

  const userId = userResult.Item.email; // dùng email làm userId

  const result = await ddb.send(
    new ScanCommand({
      TableName: "Messages",
      FilterExpression: "#sender = :uid OR #receiver = :uid",
      ExpressionAttributeNames: {
        "#sender": "sender",
        "#receiver": "receiver",
      },
      ExpressionAttributeValues: { ":uid": userId },
    })
  );

  const msgs = result?.Items ?? [];
  if (msgs.length === 0) return [];

  const chatMap = {};

  for (const msg of msgs) {
    if (!msg.roomId) continue;
    if (!chatMap[msg.roomId] || msg.createdAt > chatMap[msg.roomId].createdAt) {
      chatMap[msg.roomId] = msg;
    }
  }

  return await Promise.all(
    Object.values(chatMap).map(async (msg) => {
      const baseRoomId = msg.roomId.split("_")[0];       // "r1"
      const otherUserId = msg.sender === userId ? msg.receiver : msg.sender;

      const otherUserResult = await ddb.send(
        new GetCommand({
          TableName: "Users",
          Key: { email: otherUserId },
        })
      );

      const otherUser = otherUserResult.Item ?? {};

      const roomResult = await ddb.send(
        new GetCommand({
          TableName: "Rooms",
          Key: { id: baseRoomId },
        })
      );

      const room = roomResult.Item ?? {};

      // ✅ LOGIC HIỂN THỊ TITLE:
      // User là landlord ⇒ dùng room.title
      // User là student ⇒ dùng tên landlord
      const isLandlord = room.landlordId === userId;

      return {
        roomId: msg.roomId,     // r1_emailStudent
        lastMessage: msg.text,
        lastTime: msg.createdAt,
        title: isLandlord ? otherUser.name : room.title,
        otherUserId,
      };
    })
  );
};


