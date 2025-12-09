// src/socket.js
import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API_URL_WS, {
  transports: ["websocket"],
  autoConnect: true,
});
