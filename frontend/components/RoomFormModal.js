"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { AMENITIES } from "@/mockData"

export default function RoomFormModal({ roomToEdit, onClose, onSave }) {
  const [room, setRoom] = useState(
    roomToEdit || {
      title: "",
      location: "",
      price: "",
      area: "",
      amenities: [],
      imageUrl: "",
      description: "",
    },
  )
  const isEditMode = !!roomToEdit

  const handleChange = (e) => {
    const { name, value } = e.target
    setRoom((prev) => ({ ...prev, [name]: value }))
  }

  const handleAmenityChange = (key) => {
    setRoom((prev) => {
      const newAmenities = prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key]
      return { ...prev, amenities: newAmenities }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Thay thế bằng API POST/PUT đến API Gateway/Lambda
    onSave(room)
    onClose()
  }

  const Input = ({ label, name, type = "text", placeholder, value, required = true }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Sửa Phòng Trọ" : "Đăng Tin Phòng Trọ Mới"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <Input label="Tiêu đề" name="title" placeholder="Phòng trọ đẹp, full nội thất..." value={room.title} />
          <Input label="Địa chỉ/Khu vực" name="location" placeholder="Quận 1, TP.HCM" value={room.location} />
          <Input label="Giá (VNĐ/tháng)" name="price" type="number" placeholder="4500000" value={room.price} />
          <Input label="Diện tích (m²)" name="area" type="number" placeholder="25" value={room.area} />
          <Input
            label="URL Hình ảnh (Mô phỏng S3)"
            name="imageUrl"
            placeholder="https://placehold.co/400x300..."
            value={room.imageUrl}
            required={false}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiện ích</label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity.key} className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={room.amenities.includes(amenity.key)}
                    onChange={() => handleAmenityChange(amenity.key)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2 border-gray-300"
                  />
                  {amenity.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={room.description}
              onChange={handleChange}
              rows="3"
              placeholder="Mô tả chi tiết về phòng trọ và các quy định..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
          >
            {isEditMode ? "Lưu Thay Đổi" : "Đăng Tin Mới"}
          </button>
        </form>
      </div>
    </div>
  )
}
