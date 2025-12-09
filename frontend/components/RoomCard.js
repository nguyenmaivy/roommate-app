"use client";
import Link from "next/link";
import { MapPin, Ruler, Zap, Heart, MessageSquare, Edit, Trash2 } from "lucide-react";
import { USER_ROLES } from "@/mockData";
import { useEffect, useState } from "react";

// Danh sách tiện ích (có thể để trong file riêng, nhưng tạm để đây cho đơn giản)
export const AMENITIES = [
  { key: "frn", label: "Đầy đủ nội thất" },
  { key: "mez", label: "Có gác" },
  { key: "kit", label: "Có kệ bếp" },
  { key: "airCon", label: "Có máy lạnh" },
  { key: "wm", label: "Có máy giặt" },
  { key: "ref", label: "Có tủ lạnh" },
  { key: "flxh", label: "Giờ giấc tự do" },
  { key: "sec24", label: "Có bảo vệ 24/24" },
  { key: "elv", label: "Có thang máy" },
  { key: "parking", label: "Có hầm để xe" },
  { key: "nso", label: "Không chung chủ" },
];

export default function RoomCard({
  room,
  currentUserId,
  userRole,
  toggleFavorite,
  onEdit,
  onDelete,
  onChat,
}) {
  const isOwner = room.landlordId === currentUserId && userRole === USER_ROLES.LANDLORD;
  const isFavorite = room.isFavorite || false;

  const [roomAmenities, setRoomAmenities] = useState("Không có");

  useEffect(() => {
    if (room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0) {
      const labels = AMENITIES
        .filter((a) => room.amenities.includes(a.key))
        .map((a) => a.label)
        .join(", ");
      setRoomAmenities(labels || "Không có");
    }
  }, [room.amenities]);

  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row">
      {/* Ảnh từ S3 */}
      <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden bg-gray-200">
        <img
          src={room.imageUrl?.[0] || "https://placehold.co/600x400/CCCCCC/666666?text=No+Image"}
          alt={room.title || "Phòng trọ"}
          className="w-full h-full object-cover transition duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400/CCCCCC/666666?text=No+Image";
          }}
        />
      </div>

      {/* Nội dung */}
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{room.title || room.address}</h3>
          <p className="text-3xl font-extrabold text-red-600 mt-2">
            {new Intl.NumberFormat("vi-VN").format(room.price)}₫
            <span className="text-sm font-normal text-gray-500">/tháng</span>
          </p>

          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              {room.address || "Không có địa chỉ"}
            </p>
            <p className="flex items-center">
              <Ruler className="w-4 h-4 mr-2 text-red-500" />
              {room.area || "?"} m²
            </p>
            <p className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-red-500" />
              Tiện ích: <span className="ml-1 font-medium">{roomAmenities}</span>
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="mt-6 flex flex-wrap gap-3">
          {isOwner ? (
            <>
              <button
                onClick={() => onEdit(room)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Edit className="w-4 h-4" /> Sửa
              </button>
              <button
                onClick={() => onDelete(room.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" /> Xóa
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFavorite(room.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isFavorite
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
                {isFavorite ? "Đã lưu" : "Lưu tin"}
              </button>

              <button
                onClick={() => onChat(room)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <MessageSquare className="w-4 h-4" /> Chat ngay
              </button>
            </>
          )}

          <Link href={`/room/${room.id}`}>
            <button className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
              Xem chi tiết →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}