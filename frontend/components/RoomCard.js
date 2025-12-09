"use client"
import Link from "next/link"
import { MapPin, Ruler, Zap, Heart, MessageSquare, Edit, Trash2 } from "lucide-react"
import { AMENITIES, USER_ROLES  } from "@/mockData"

export default function RoomCard({ room, currentUserId, userRole, toggleFavorite, onEdit, onDelete, onChat }) {
  const isOwner = room.landlordId === currentUserId && userRole === USER_ROLES .LANDLORD
  const isFavorite = room.isFavorite

  // Thay thế bằng logic API thực tế khi triển khai DynamoDB
  const roomAmenities = AMENITIES.filter((a) => room.amenities.includes(a.key))
    .map((a) => a.label)
    .join(", ")

  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row">
      {/* Ảnh Phòng Trọ (S3/CloudFront) */}
      <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden">
        {/* <img
          src={room.imageUrl || room.images?.[0]}
          alt={room.title || room.address}
          className="w-full h-full object-cover transition duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "https://placehold.co/400x300/CCCCCC/333333?text=No+Image"
          }}
        /> */}
        
        <img
          src={room.imageUrl?.[0] || "/placeholder.jpg"}
          alt="Room"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      {/* Chi tiết Phòng Trọ */}
      <div className="md:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{room.title || room.address}</h3>
          <p className="text-3xl font-extrabold text-indigo-600 mb-3">
            {new Intl.NumberFormat("vi-VN").format(room.price)} VNĐ
            <span className="text-sm font-normal text-gray-500">/tháng</span>
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-indigo-400" /> {room.address || (room.location && `${room.location.lat}, ${room.location.lng}`)}
            </p>
            <p className="flex items-center">
              <Ruler className="w-4 h-4 mr-2 text-indigo-400" /> {room.area} m²
            </p>
            <p className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-indigo-400" /> Tiện ích: {roomAmenities || "Không có"}
            </p>
          </div>
        </div>

        {/* Thanh Hành động */}
        <div className="mt-4 flex flex-wrap gap-2">
          {isOwner ? (
            <>
              <button
                onClick={() => onEdit(room)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
              >
                <Edit className="w-4 h-4 mr-1" /> Sửa
              </button>
              <button
                onClick={() => onDelete(room.id)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Xóa
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFavorite(room.id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isFavorite ? "fill-white" : "text-red-500"}`} />
                {isFavorite ? "Đã lưu" : "Lưu"}
              </button>
              <button
                onClick={() => onChat(room)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
              >
                <MessageSquare className="w-4 h-4 mr-1" /> Chat ngay
              </button>
            </>
          )}
          <Link href={`/room/${room.id}`}>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
              Xem Chi Tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
