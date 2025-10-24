"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Search, CheckCircle, Plus, UserIcon, Building, X, LayoutGrid } from "lucide-react"
import RoomCard from "@/components/RoomCard"
import RoomFormModal from "@/components/RoomFormModal"
import ChatModal from "@/components/ChatModal"
import { AMENITIES, USER_ROLES, MOCK_ROOMS } from "@/mockData"

interface Room {
  id: string
  title: string
  address: string
  location?: string
  price: number
  area: number
  amenities: string[]
  landlordId: string
  description: string
  imageUrl?: string
  images?: string[]
  isFavorite: boolean
}

interface AppUser {
  id: string
  name?: string
  role: string
}

interface Filters {
  location: string
  minPrice: string
  maxPrice: string
  minArea: string
  maxArea: string
  amenities: string[]
  showFavorites: boolean
}

export default function Home() {
  // State mô phỏng Dữ liệu từ DynamoDB
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS.map((r) => ({ ...r, isFavorite: false })))
  const [favorites, setFavorites] = useState<string[]>([])

  // State mô phỏng Auth từ Cognito
  const [user, setUser] = useState<AppUser>({ id: "U1", role: USER_ROLES.STUDENT })
  const isLandlord = user.role === USER_ROLES.LANDLORD

  // State cho Thanh tìm kiếm/lọc
  const [filters, setFilters] = useState<Filters>({
    location: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    amenities: [],
    showFavorites: false,
  })

  // State cho Modal Thêm/Sửa
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  // State cho Modal Chat
  const [chatRoom, setChatRoom] = useState<Room | null>(null)

  // --- HANDLERS DỮ LIỆU ---

  /** Toggle trạng thái Favorite (Lưu) */
  const toggleFavorite = useCallback((roomId: string) => {
    // Thay thế bằng API cập nhật trạng thái Favorite cho User (DynamoDB User Profile)
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          const newFavorite = !room.isFavorite
          if (newFavorite) {
            setFavorites((prev) => [...prev, roomId])
          } else {
            setFavorites((prev) => prev.filter((id) => id !== roomId))
          }
          return { ...room, isFavorite: newFavorite }
        }
        return room
      }),
    )
  }, [])

  /** Mở form Sửa phòng trọ */
  const handleEdit = useCallback((room: Room) => {
    setEditingRoom(room)
    setShowFormModal(true)
  }, [])

  /** Xóa phòng trọ */
  const handleDelete = useCallback((roomId: string) => {
    // Thay thế bằng custom modal UI thay vì window.confirm
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng trọ này?")) {
      // Thay thế bằng API DELETE đến API Gateway/Lambda
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId))
      console.log(`[API MOCK] Đã gọi DELETE cho room ID: ${roomId}`)
    }
  }, [])

  /** Lưu (Thêm/Sửa) phòng trọ */
  const handleSaveRoom = useCallback(
    (roomData: any) => {
      // Thay thế bằng API POST/PUT đến API Gateway/Lambda
      if (editingRoom) {
        // Cập nhật
        setRooms((prevRooms) => prevRooms.map((r) => (r.id === roomData.id ? { ...r, ...roomData } : r)))
        console.log(`[API MOCK] Đã gọi PUT (Sửa) cho room ID: ${roomData.id}`)
      } else {
        // Thêm mới
        const newId = `r${Date.now()}`
        const newRoom: Room = {
          ...roomData,
          id: newId,
          landlordId: user.id, // Gán ID chủ trọ hiện tại
          isFavorite: false,
          price: Number(roomData.price),
          area: Number(roomData.area),
        }
        setRooms((prevRooms) => [newRoom, ...prevRooms])
        // Mô phỏng n8n: Gửi thông báo khi có phòng mới
        console.log(`[n8n MOCK] Kích hoạt workflow gửi email/Telegram thông báo phòng mới: ${newRoom.title}`)
        console.log(`[API MOCK] Đã gọi POST (Thêm mới) cho room ID: ${newId}`)
      }
      setEditingRoom(null)
      setShowFormModal(false)
    },
    [editingRoom, user.id],
  )

  /** Lọc dữ liệu phòng trọ */
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Lọc theo Vị trí (dùng address)
      if (filters.location && !(room.address || "").toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      // Lọc theo Giá
      const price = room.price
      if (filters.minPrice && price < Number(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && price > Number(filters.maxPrice)) {
        return false
      }

      // LỌC THEO DIỆN TÍCH
      const area = room.area
      if (filters.minArea && area < Number(filters.minArea)) {
        return false
      }
      if (filters.maxArea && area > Number(filters.maxArea)) {
        return false
      }

      // Lọc theo Tiện ích
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenityKey) => room.amenities.includes(amenityKey))
        if (!hasAllAmenities) return false
      }
      // Lọc theo Favorite
      if (filters.showFavorites && !favorites.includes(room.id)) {
        return false
      }
      // Nếu là Chủ trọ, chỉ hiển thị phòng của mình
      if (isLandlord && room.landlordId !== user.id) {
        return false
      }
      return true
    })
  }, [rooms, filters, favorites, isLandlord, user.id])

  // --- UI CONTROLS ---

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleAmenityFilter = (key: string) => {
    setFilters((prev) => {
      const newAmenities = prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key]
      return { ...prev, amenities: newAmenities }
    })
  }

  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      amenities: [],
      showFavorites: false,
    })
  }

  const handleSwitchUser = () => {
    // Mô phỏng đăng nhập/đăng xuất Cognito
    if (user.role === USER_ROLES.STUDENT) {
      setUser({ id: "L1", name: "Trần Văn B (Chủ trọ)", role: USER_ROLES.LANDLORD })
    } else {
      setUser({ id: "U1", name: "Nguyễn Văn A (Sinh viên)", role: USER_ROLES.STUDENT })
    }
    // Reset filters khi đổi vai trò
    handleClearFilters()
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:space-x-8">
          {/* Sidebar / Bộ lọc */}
          <div className="lg:w-1/4 w-full mb-8 lg:mb-0">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky lg:top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                <Search className="w-5 h-5 mr-2 text-indigo-500" /> Tìm kiếm & Lọc
              </h2>

              {/* Lọc theo Vị trí */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí (Quận/Huyện)</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="VD: Quận 5, Thủ Đức"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Lọc theo Giá */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng giá (VNĐ)</label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* LỌC THEO DIỆN TÍCH */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    name="minArea"
                    value={filters.minArea}
                    onChange={handleFilterChange}
                    placeholder="Min (m²)"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    name="maxArea"
                    value={filters.maxArea}
                    onChange={handleFilterChange}
                    placeholder="Max (m²)"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Lọc theo Tiện ích */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiện ích</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map((amenity) => (
                    <button
                      key={amenity.key}
                      onClick={() => handleAmenityFilter(amenity.key)}
                      className={`flex items-center justify-center p-2 text-xs rounded-lg border transition ${
                        filters.amenities.includes(amenity.key)
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> {amenity.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc theo Favorite (Chỉ Sinh viên) */}
              {user.role === USER_ROLES.STUDENT && (
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.showFavorites}
                      onChange={(e) => setFilters((prev) => ({ ...prev, showFavorites: e.target.checked }))}
                      className="rounded text-red-500 focus:ring-red-500 h-4 w-4 mr-2 border-gray-300"
                    />
                    Chỉ xem phòng <strong> Đã Lưu</strong> ({favorites.length})
                  </label>
                </div>
              )}

              {/* Nút Xóa bộ lọc */}
              <button
                onClick={handleClearFilters}
                className="w-full py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium border border-gray-300 flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-1" /> Xóa bộ lọc
              </button>

              <button
                onClick={handleSwitchUser}
                className="w-full mt-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium border border-indigo-300 flex items-center justify-center"
              >
                <UserIcon className="w-4 h-4 mr-1" /> Đổi vai trò ({user.role})
              </button>
            </div>
          </div>

          {/* Nội dung chính / Danh sách Phòng trọ */}
          <div className="lg:w-3/4 w-full">
            {/* Khu vực Chủ trọ (Quản lý) */}
            {isLandlord && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex justify-between items-center shadow-md">
                <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                  <Building className="w-6 h-6 mr-2" /> Quản lý tin đăng của bạn
                </h2>
                <button
                  onClick={() => {
                    setEditingRoom(null)
                    setShowFormModal(true)
                  }}
                  className="flex items-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-5 h-5 mr-1" /> Đăng tin mới
                </button>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <LayoutGrid className="w-6 h-6 mr-2 text-indigo-500" />
              {isLandlord ? "Phòng trọ đã đăng" : "Danh sách phòng trọ"} ({filteredRooms.length})
            </h2>

            {/* Danh sách Phòng trọ */}
            <div className="space-y-6">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    currentUserId={user.id}
                    userRole={user.role}
                    toggleFavorite={toggleFavorite}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChat={setChatRoom}
                  />
                ))
              ) : (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                  <p className="text-xl text-gray-500 font-medium">
                    Không tìm thấy phòng trọ nào phù hợp với tiêu chí lọc.
                  </p>
                  <p className="text-gray-400 mt-2">Hãy thử điều chỉnh lại bộ lọc của bạn.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Thêm/Sửa Phòng Trọ */}
      {showFormModal && isLandlord && (
        <RoomFormModal roomToEdit={editingRoom} onClose={() => setShowFormModal(false)} onSave={handleSaveRoom} />
      )}

      {/* Modal Chat Mini */}
      {chatRoom && <ChatModal room={chatRoom} onClose={() => setChatRoom(null)} />}
    </div>
  )
}
