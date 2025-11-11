import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { handler as registerUserHandler, __setDocumentClient as setRegisterClient } from "./lambda/registerUser.js";
import { handler as loginUserHandler, __setDocumentClient as setLoginClient } from "./lambda/loginUser.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createRoom, getRooms, getRoom, updateRoom, deleteRoom, __setDocumentClient as setRoomClient } from "./lambda/roomCrud.js";
import { initChatRealtime, getMessages, __setDocumentClient as setChatClient } from "./lambda/chatMessage.js";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
const port = 3001;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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

// --- Register ---
app.post("/register", async (req, res) => {
  const event = { body: JSON.stringify(req.body) };
  const response = await registerUserHandler(event);
  res.status(response.statusCode).json(JSON.parse(response.body));
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
    secure: false,           // nếu deploy HTTPS thì đổi thành true
    sameSite: "lax",         // ngăn CSRF cơ bản
    path: "/",               // phải giống path lúc set cookie!
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

// --- Middleware kiểm tra JWT ---
import jwt from "jsonwebtoken";
import { meUserHandler } from "./lambda/meUser.js";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

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
    console.log("Cookies:", req.cookies);  // ✅ kiểm tra cookie nhận từ browser

    const response = await meUserHandler(req);

    console.log("ME handler response:", response); // ✅ kiểm tra kết quả lambda

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


// --- Example route bảo vệ ---
app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected profile", user: req.user });
});

// Khởi tạo chat realtime
initChatRealtime(io);

// Start server
server.listen(port, () => console.log(`⚡ Local server + Socket.IO running at http://localhost:${port}`));
