'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Ruler, Zap, Heart, MessageSquare, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { AMENITIES, USER_ROLES } from '@/mockData';
import ChatModal from '@/components/ChatModal';

export default function RoomDetailPage() {
  const params = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useState({ id: 'U1', role: USER_ROLES.STUDENT });
  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`/api/proxy/rooms/${params.id}`);
        const data = await res.json();
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin phòng trọ...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy phòng trọ</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const roomAmenities = AMENITIES.filter(a => room.amenities.includes(a.key)).map(a => a.label);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nội dung chính */}
          <div className="lg:col-span-2">
            {/* Ảnh phòng trọ */}
            <div className="mb-6">
              <img
                src={room.imageUrl || room.images?.[0]}
                alt={room.title || room.address}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/CCCCCC/333333?text=No+Image" }}
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{room.title || room.address}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-500" />
                  <span>{room.location || room.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Ruler className="w-5 h-5 mr-3 text-indigo-500" />
                  <span>{room.area} m²</span>
                </div>
              </div>

              {/* Mô tả */}
              {room.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Mô tả</h3>
                  <p className="text-gray-600 leading-relaxed">{room.description}</p>
                </div>
              )}

              {/* Tiện ích */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Tiện ích</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roomAmenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <Zap className="w-4 h-4 mr-2 text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Đánh giá (Mock) */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Đánh giá</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">4.5/5 (12 đánh giá)</span>
                </div>
                <p className="text-sm text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              {/* Giá */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {new Intl.NumberFormat('vi-VN').format(room.price)} VNĐ
                </div>
                <div className="text-gray-500">/tháng</div>
              </div>

              {/* Thông tin chủ trọ */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Chủ trọ</h4>
                <p className="text-gray-600">ID: {room.landlordId}</p>
                <p className="text-sm text-gray-500">Đã tham gia: 2 năm</p>
              </div>

              {/* Nút hành động */}
              <div className="space-y-3">
                <button
                  onClick={() => setChatRoom(room)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Liên hệ chủ trọ
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                  <Heart className="w-5 h-5 mr-2" />
                  Lưu phòng này
                </button>
              </div>

              {/* Thông tin bổ sung */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Thông tin bổ sung</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Phòng đã được xác minh</p>
                  <p>• Có thể xem phòng ngay</p>
                  <p>• Hỗ trợ 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chat */}
      {chatRoom && (
        <ChatModal
          room={chatRoom}
          onClose={() => setChatRoom(null)}
        />
      )}
    </div>
  );
}