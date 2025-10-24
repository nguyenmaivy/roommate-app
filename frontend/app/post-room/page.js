'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AMENITIES, USER_ROLES } from '@/mockData';
import RoomFormModal from '@/components/RoomFormModal';

export default function PostRoomPage() {
  const router = useRouter();
  const [user] = useState({ id: 'L1', role: USER_ROLES.LANDLORD }); // Mock

  const handleSaveRoom = async (roomData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...roomData, landlordId: user.id, price: Number(roomData.price), area: Number(roomData.area) }),
      });
      if (res.ok) router.push('/search');
    } catch (error) {
      console.error('Save room error:', error);
    }
  };

  if (user.role !== USER_ROLES.LANDLORD) return <p>Chỉ chủ trọ được đăng tin.</p>;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Đăng Tin Phòng Trọ</h2>
      <RoomFormModal roomToEdit={null} onClose={() => router.push('/')} onSave={handleSaveRoom} />
    </div>
  );
}