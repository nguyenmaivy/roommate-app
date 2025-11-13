'use client';

import { useState, useEffect } from 'react';
import { Home, User, LogOut } from 'lucide-react';
import Link from 'next/link';
// import { getCurrentUser, signOut } from 'aws-amplify/auth';
// import { USER_ROLES, INITIAL_USER } from '@/mockData';
import AuthModal from "./AuthModel"
import { useUser } from '@/app/Store/UserContext';

export default function Navbar() {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState({ open: false, mode: "login" })
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: "include", // ✅ gửi cookie
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser({
          id: data.user.email,
          name: data.user.name,
          role: data.user.role,
        });
        setIsLoggedIn(true);
      } catch { }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      credentials: "include", // ✅ gửi cookie để backend xoá
    });

    setUser({});
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = (newUser) => {
    setUser(newUser)
    setIsLoggedIn(true)
  }

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-indigo-600 flex items-center">
            <Home className="w-8 h-8 mr-2" /> RoomMate
          </Link>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1 text-indigo-500" />
                  <span>
                    Xin chào, <strong>{user.name.split(" ")[0]}</strong>
                  </span>
                </div>
                <Link href="/search" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Tìm Phòng
                </Link>
                <Link href="/post-room" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Đăng Tin
                </Link>
                <Link href="/chat" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/search" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Tìm Phòng
                </Link>
                <button
                  onClick={() => setShowAuthModal({ open: true, mode: "login" })}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setShowAuthModal({ open: true, mode: "signup" })}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal.open}
        onClose={() => setShowAuthModal({ open: false, mode: "login" })}
        onLoginSuccess={handleLoginSuccess}
        mode={showAuthModal.mode}
      />
    </>
  )
}