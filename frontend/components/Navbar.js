'use client';

import { useState, useEffect } from 'react';
import { Home, User } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from 'aws-amplify/auth';
import { USER_ROLES, INITIAL_USER } from '@/mockData';
import { get } from 'http';

export default function Navbar() {
  const [user, setUser] = useState(INITIAL_USER);

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser({
          id: currentUser.userId,
          name: currentUser.username || 'User',
          role: USER_ROLES.STUDENT,
        });
      } catch {
        setUser(INITIAL_USER);
      }
    }
    checkUser();
  }, []);

  const handleSwitchUser = async () => {
    if (user.role === USER_ROLES.STUDENT) {
      setUser({ id: "L1", name: "Trần Văn B (Chủ trọ)", role: USER_ROLES.LANDLORD })
    } else {
      setUser(INITIAL_USER)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold text-indigo-600 flex items-center">
          <Home className="w-8 h-8 mr-2" /> RoomMate
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-1 text-indigo-500" />
            <span>Xin chào, <strong>{user.name.split(' ')[0]}</strong> ({user.role === USER_ROLES.STUDENT ? 'SV' : 'CT'})</span>
          </div>
          <Link href="/search" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Tìm Phòng</Link>
          <Link href="/post-room" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Đăng Tin</Link>
          <Link href="/chat" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Chat</Link>
          <button onClick={handleSwitchUser} className="px-3 py-1 text-sm bg-gray-200 rounded-full hover:bg-gray-300 transition font-medium">
            Chuyển vai trò
          </button>
        </div>
      </div>
    </header>
  );
}