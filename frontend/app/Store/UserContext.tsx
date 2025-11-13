"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket";
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Khi user thay đổi → tự động đăng ký userId/email lên server
  useEffect(() => {
    if (user?.id) {
      socket.emit("register", user.id);
      console.log("📡 Registered user:", user.id);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
