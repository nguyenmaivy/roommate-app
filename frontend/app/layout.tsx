import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RoomMate - Tìm Phòng Trọ Dễ Dàng',
  description: 'Ứng dụng tìm kiếm và quản lý phòng trọ cho sinh viên',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          &copy; 2025 RoomMate. All rights reserved.
        </footer>
      </body>
    </html>
  );
}