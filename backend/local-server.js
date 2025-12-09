import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { handler as registerUserHandler, __setDocumentClient as setRegisterClient } from "./lambda/registerUser.js";
import { handler as loginUserHandler, __setDocumentClient as setLoginClient } from "./lambda/loginUser.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createRoom, getRooms, getRoom, updateRoom, deleteRoom, __setDocumentClient as setRoomClient } from "./lambda/roomCrud.js";
import { initChatRealtime, getMessages, getUserChats, __setDocumentClient as setChatClient } from "./lambda/chatMessage.js";
import { switchRoleHandler, __setDocumentClient as setSwitchRole } from "./lambda/switchRole.js";
import { getAmenities, __setDocumentClient as setAmenities } from "./lambda/amenities.js";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

// --- Middleware kiểm tra JWT ---
import jwt from "jsonwebtoken";
import { meUserHandler } from "./lambda/meUser.js";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const app = express();
const port = 3001;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Khi user login xong, client gửi userId để đăng ký
  socket.on("register", (userId) => {
    users.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} registered as ${socket.id}`);
    // Gửi danh sách người online (tùy chọn)
    io.emit("online-users", Array.from(users.keys()));
  });
  // Khi user kết thúc cuộc gọi
  socket.on("end-call", ({ to }) => {
    const targetSocket = users.get(to); // to = email, hoặc userId

    console.log("📴 END CALL → map to socket:", targetSocket);

    if (targetSocket) {
      io.to(targetSocket).emit("call-ended");
    } else {
      console.log("⚠️ Không tìm thấy socket cho:", to);
    }
  });

  // Khi user từ chối cuộc gọi
  socket.on("reject-call", ({ to }) => {
    console.log(`❌ Cuộc gọi bị từ chối bởi ${socket.id}, gửi thông báo tới ${to}`);
    io.to(to).emit("call-rejected");
  });

  // Khi user gọi người khác
  socket.on("call-user", ({ to, offer }) => {
    console.log(`📞 ${socket.id} gọi tới userId ${to}`);
    const targetSocket = users.get(to);
    console.log("🎯 targetSocket:", targetSocket);
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", { from: socket.userId, offer });
    } else {
      console.log("❌ Không tìm thấy userId", to);
    }
  });


  // Khi user trả lời
  socket.on("answer-call", ({ to, answer }) => {
    const targetSocket = users.get(to); // to = email
    console.log("➡️ answer-call → gửi đến socket:", targetSocket);

    if (targetSocket) {
      io.to(targetSocket).emit("call-answered", { answer });
    } else {
      console.log("⚠️ Không tìm thấy socket để gửi answer-call:", to);
    }
  });

  // Khi ngắt kết nối
  socket.on("disconnect", () => {
    for (let [userId, id] of users.entries()) {
      if (id === socket.id) users.delete(userId);
    }
    io.emit("online-users", Array.from(users.keys()));
  });
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(bodyParser.json());
app.use(cookieParser());

// DynamoDB Local
const client = new DynamoDBClient({ region: "us-east-1", endpoint: "http://localhost:8000", credentials: { accessKeyId: "fake", secretAccessKey: "fake" } });
const ddb = DynamoDBDocumentClient.from(client);
setRegisterClient(ddb);
setLoginClient(ddb);
setRoomClient(ddb);
setChatClient(ddb);
setSwitchRole(ddb);
setAmenities(ddb);
// --- Register ---
app.post("/register", async (req, res) => {
  const event = { body: JSON.stringify(req.body) };
  const response = await registerUserHandler(event);
  res.set(response.headers || {})
     .status(response.statusCode)
     .json(JSON.parse(response.body));
});


// --- Login ---
app.post("/login", async (req, res) => {
  const event = { body: JSON.stringify(req.body) };
  const response = await loginUserHandler(event);
  // Trả luôn cookie từ Lambda
  res.set(response.headers || {}).status(response.statusCode).json(JSON.parse(response.body));
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
app.get("/me", async (req, res) => {
  try {
    const response = await meUserHandler(req);
    res
      .set(response.headers || {})
      .status(response.statusCode)
      .json(JSON.parse(response.body));
  } catch (err) {
    console.error("🔥 ERROR in /me:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE
app.post("/rooms", async (req, res) => {
  const response = await createRoom({ body: JSON.stringify(req.body) });
  res.status(response.statusCode).json(JSON.parse(response.body));
});

// READ ALL
app.get("/rooms", async (req, res) => {
  const response = await getRooms();
  res.status(response.statusCode).json(JSON.parse(response.body));
});

// READ ONE
app.get("/rooms/:roomId", async (req, res) => {
  const response = await getRoom({ params: req.params });
  res.status(response.statusCode).json(JSON.parse(response.body));
});

// UPDATE
app.put("/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const response = await updateRoom(roomId, req.body);

    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/rooms/:roomId", async (req, res) => {
  const response = await deleteRoom({ params: req.params });
  res.status(response.statusCode).json(JSON.parse(response.body));
});
app.get("/messages/:roomId", async (req, res) => {
  const response = await getMessages(req);    // <-- sử dụng hàm đã export
  res.status(response.statusCode).json(JSON.parse(response.body));
});
app.get("/chats", async (req, res) => {
  try {
    let email;

    const decoded = jwt.verify(req.cookies.token, JWT_SECRET);
    email = decoded.email;  // email là PK trong bảng Users

    if (!email) {
      return res.status(400).json({ error: "email required" });
    }

    const chats = await getUserChats(email);
    res.json(chats);
  } catch (err) {
    console.error("/chats error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/switch-role", authMiddleware, async (req, res) => {
  try {
    const response = await switchRoleHandler(req);

    res
      .set(response.headers || {})
      .status(response.statusCode)
      .send(response.body);
  } catch (err) {
    console.error("🔥 ERROR in /switch-role:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ ALL AMENITIES
app.get("/amenities", async (req, res) => {
  const response = await getAmenities();
  res.status(response.statusCode).json(JSON.parse(response.body));
});

// --- Example route bảo vệ ---
app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected profile", user: req.user });
});

// Khởi tạo chat realtime
initChatRealtime(io);

// Start server
server.listen(port, () => console.log(`⚡ Local server + Socket.IO running at http://localhost:${port}`));
