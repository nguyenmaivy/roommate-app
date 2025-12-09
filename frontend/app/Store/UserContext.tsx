"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../socket";

interface User {
  id?: string;
  role?: string;
  [key: string]: any;
  email: string;
  name: string;
  phone: string;
  
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // ← SỬA Ở ĐÂY
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
