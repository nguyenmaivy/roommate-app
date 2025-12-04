"use client";

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { ArrowLeft, ImageIcon, Video, Phone } from "lucide-react"

const HCMC_DISTRICTS = [
  { id: 1, name: "Quận 1" },
  { id: 2, name: "Quận 2" },
  { id: 3, name: "Quận 3" },
  { id: 4, name: "Quận 4" },
  { id: 5, name: "Quận 5" },
  { id: 6, name: "Quận 6" },
  { id: 7, name: "Quận 7" },
  { id: 8, name: "Quận 8" },
  { id: 9, name: "Quận 9" },
  { id: 10, name: "Quận 10" },
  { id: 11, name: "Quận 11" },
  { id: 12, name: "Quận 12" },
  { id: "bthạnh", name: "Quận Bình Thạnh" },
  { id: "btan", name: "Quận Bình Tân" },
  { id: "gtrai", name: "Quận Gò Vấp" },
  { id: "pnhuận", name: "Quận Phú Nhuận" },
  { id: "tâulàu", name: "Quận Tân Bình" },
  { id: "tauphu", name: "Quận Tân Phú" },
  { id: "thuduc", name: "TP. Thủ Đức" },
]

const CATEGORIES = [
  { id: 1, name: "Phòng trọ, nhà trọ" },
  { id: 2, name: "Nhà thuê nguyên căn" },
  { id: 3, name: "Căn hộ" },
]

const FEATURES = [
  { id: "full_noi_that", label: "Đầy đủ nội thất" },
  { id: "gac", label: "Có gác" },
  { id: "ke_bep", label: "Có kệ bếp" },
  { id: "may_lanh", label: "Có máy lạnh" },
  { id: "may_giat", label: "Có máy giặt" },
  { id: "tu_lanh", label: "Có tủ lạnh" },
  { id: "thang_may", label: "Có thang máy" },
  { id: "khong_chung_chu", label: "Không chung chủ" },
  { id: "tu_do", label: "Giờ giấc tự do" },
  { id: "bao_ve", label: "Có bảo vệ 24/24" },
  { id: "ham_de_xe", label: "Có hầm để xe" },
]

export default function PostPage() {
  const [activeTab, setActiveTab] = useState("khuvuc")
  const [user, setUser] = useState(null)
  const [isLastTab, setIsLastTab] = useState(false)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    district: "",
    ward: "",
    street: "",
    streetNumber: "",
    price: "",
    priceUnit: "0",
    area: "",
    features: [],
    description: "",
    contactName: "",
    contactPhone: "",
  })

  useEffect(() => {
    let isMounted = true

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/me", {
          credentials: "include",
        })

        if (!res.ok) {
          if (isMounted) setUser(null)
          return
        }

        const data = await res.json()
        if (isMounted) {
          setUser(data.user)
        }
      } catch {
        if (isMounted) setUser(null)
      }
    }

    fetchCurrentUser()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!user) return

    setFormData((prev) => {
      let updated = false
      const next = { ...prev }

      if (user.name && prev.contactName !== user.name) {
        next.contactName = user.name
        updated = true
      }

      if (user.phone && prev.contactPhone !== user.phone) {
        next.contactPhone = user.phone
        updated = true
      }

      if (!updated) {
        return prev
      }

      return next
    })
  }, [user])

  const tabs = [
    { id: "khuvuc", label: "Khu vực" },
    { id: "thongtinmota", label: "Thông tin mô tả" },
    { id: "hinhanh", label: "Hình ảnh" },
    { id: "video", label: "Video" },
    { id: "thongtinlienhe", label: "Thông tin liên hệ" },
  ]

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab)
    setCurrentTabIndex(index)
    setIsLastTab(index === tabs.length - 1)
  }, [activeTab, tabs])

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(id) ? prev.features.filter((f) => f !== id) : [...prev.features, id],
    }))
  }
  console.log("Is Last Tab:", isLastTab)

  const handleSubmit = (e) => {
    console.log("Is Last Tab:", isLastTab)
    e.preventDefault()
    console.log("Form data:", formData)
    alert("Đăng tin thành công!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-white shadow-sm border-b">
        <div className="max-w-full px-4 lg:px-8">
          <div className="flex items-center justify-between py-4 mb-4">
            <Link href="/">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Đăng tin cho thuê</h1>
            <div className="w-24"></div>
          </div>

          {/* Navigation Tabs */}
          <nav className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-52">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-full bg-gray-300 mx-auto mb-3"></div>
                <h3 className="font-semibold text-gray-800">
                  {user?.name || "Khách chưa đăng nhập"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.phone || "Chưa cập nhật số điện thoại"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {user?.email ? `Email: ${user.email}` : "Vui lòng đăng nhập để xem chi tiết"}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-700 mb-2">Số dư tài khoản</p>
                <p className="text-lg font-bold text-gray-900 mb-3">0 đ</p>
                <button className="w-full py-2 px-3 bg-yellow-500 text-white text-xs font-semibold rounded-full hover:bg-yellow-600 transition">
                  Nạp tiền
                </button>
              </div>

              <div className="space-y-2">
                <a href="#" className="block p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Danh sách tin đăng
                </a>
                <a href="#" className="block p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Nạp tiền vào tài khoản
                </a>
                <a href="#" className="block p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Lịch sử nạp tiền
                </a>
                <a href="#" className="block p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition">
                  Quản lý tài khoản
                </a>
              </div>
            </div>
          </div>

          {/* Form - Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: KHU VỰC */}
              {activeTab === "khuvuc" && (
                <div className="space-y-6">
                  {/* Category */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Loại chuyên mục</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại chuyên mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">-- Chọn loại chuyên mục --</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Khu vực</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value="TP Hồ Chí Minh"
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">-- Chọn Quận/Huyện --</option>
                          {HCMC_DISTRICTS.map((dist) => (
                            <option key={dist.id} value={dist.id}>
                              {dist.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã</label>
                        <input
                          type="text"
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          placeholder="VD: Phường Bến Nghé"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Đường/Phố</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="VD: Nguyễn Huệ"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số nhà</label>
                        <input
                          type="text"
                          name="streetNumber"
                          value={formData.streetNumber}
                          onChange={handleChange}
                          placeholder="VD: 123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Bản đồ</h3>
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      <span>Google Maps sẽ hiển thị tại đây</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: THÔNG TIN MÔ TẢ */}
              {activeTab === "thongtinmota" && (
                <div className="space-y-6">
                  {/* Title */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Tiêu đề</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Tiêu đề bài đăng"
                        rows={2}
                        minLength={30}
                        maxLength={100}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.title.length}/100 (Tối thiểu 30 ký tự, tối đa 100 ký tự)
                      </p>
                    </div>
                  </div>

                  {/* Price & Area */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Giá & Diện tích</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá cho thuê <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <select
                            name="priceUnit"
                            value={formData.priceUnit}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="0">đồng/tháng</option>
                            <option value="1">đồng/m²/tháng</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diện tích <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="0"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <div className="flex items-center px-3 bg-gray-100 rounded-lg text-gray-700 font-medium">
                            m²
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Đặc điểm nổi bật</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FEATURES.map((feature) => (
                        <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(feature.id)}
                            onChange={() => handleFeatureToggle(feature.id)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Nội dung mô tả</h3>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Mô tả chi tiết về phòng trọ..."
                      rows={10}
                      minLength={50}
                      maxLength={5000}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.description.length}/5000 (Tối thiểu 50 ký tự)
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 3: HÌNH ẢNH */}
              {activeTab === "hinhanh" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Hình ảnh
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-gray-600 font-medium mb-2">Tải ảnh từ thiết bị</p>
                    <p className="text-xs text-gray-500">Tối đa 20 ảnh, dung lượng tối đa 10MB/ảnh</p>
                  </div>
                </div>
              )}

              {/* SECTION 4: VIDEO */}
              {activeTab === "video" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (Youtube/Tiktok)</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-gray-600 font-medium mb-2">Tải Video từ thiết bị</p>
                  </div>
                </div>
              )}

              {/* SECTION 5: THÔNG TIN LIÊN HỆ */}
              {activeTab === "thongtinlienhe" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Thông tin liên hệ
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ Tên</label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          placeholder="Họ và tên"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
                <button
                  type={isLastTab ? "submit" : "button"}
                  onClick={isLastTab ? undefined : goToNextTab}
                  className="flex-1 py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
                >
                  {isLastTab ? "Gửi tin" : "Tiếp tục →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
