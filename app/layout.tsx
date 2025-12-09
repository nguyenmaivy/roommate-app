"use client";

import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";
import { UserProvider } from "./Store/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phòng Trọ - Tìm Kiếm Phòng Trọ Chất Lượng",
  description: "Nền tảng tìm kiếm và quản lý phòng trọ hiện đại",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${_geist.className} font-sans antialiased`}>
        <UserProvider>
          <Navbar />
          <ToastContainer />
          {children}
          <ConditionalFooter />
        </UserProvider>
      </body>
    </html>
  );
}
