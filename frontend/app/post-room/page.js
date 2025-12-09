"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ImageIcon, Video, Phone, X, Upload, Loader2 } from "lucide-react";
import Location from "../../components/Location";
import { toast } from "react-toastify";
import { useUser } from "../Store/UserContext";

const RENTAL_TYPES = [
  { id: "phong_tro", name: "Cho thuê phòng trọ" },
  { id: "nha_nguyen_can", name: "Cho thuê nhà" },
  { id: "mat_bang", name: "Cho thuê mặt bằng" },
  { id: "can_ho_mini", name: "Cho thuê căn hộ mini" },
];

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
];

export default function PostPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("khuvuc");
  const [isLastTab, setIsLastTab] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    district: "",
    ward: "",
    address: "",
    price: "",
    area: "",
    features: [],
    description: "",
    contactName: user?.name || "",
    contactPhone: user?.phone || "",
    location: null,
  });

  // State cho ảnh
  const [images, setImages] = useState([]);           // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // URL preview
  const [uploading, setUploading] = useState(false);

  const tabs = [
    { id: "khuvuc", label: "Khu vực" },
    { id: "thongtinmota", label: "Thông tin mô tả" },
    { id: "hinhanh", label: "Hình ảnh" },
    { id: "thongtinlienhe", label: "Thông tin liên hệ" },
  ];

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    setCurrentTabIndex(index);
    setIsLastTab(index === tabs.length - 1);
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter(f => f !== id)
        : [...prev.features, id]
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Upload ảnh lên S3
  const uploadImagesToS3 = async () => {
    if (images.length === 0) return [];

    setUploading(true);
    const formData = new FormData();
    images.forEach(file => formData.append("files", file));

    try {
      const res = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast.success("Đã upload ảnh thành công!");
      return data.urls;
    } catch (err) {
      toast.error("Upload ảnh thất bại: " + err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Gửi tin đăng
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }

    try {
      // Bước 1: Upload ảnh lên S3
      const imageUrls = await uploadImagesToS3();

      // Bước 2: Gửi dữ liệu phòng
      const payload = {
        title: formData.title,
        rental_type: RENTAL_TYPES.find(t => t.id === formData.category)?.name || "Cho thuê phòng trọ",
        price: Number(formData.price),
        address: formData.address,
        area: Number(formData.area),
        amenities: formData.features,
        landlordId: user?.landlordId || user?.id,
        description: formData.description,
        imageUrl: imageUrls, // ← Mảng URL từ S3
        location: formData.location,
      };

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Đăng tin thất bại");

      toast.success("Đăng tin thành công!");
      // Reset form hoặc chuyển hướng
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const goToNextTab = () => {
    const nextIndex = currentTabIndex + 1;
    if (nextIndex < tabs.length) {
      setActiveTab(tabs[nextIndex].id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-orange-500 text-white p-6">
            <h1 className="text-2xl font-bold">Đăng tin cho thuê</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-center font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-4 border-orange-500 text-orange-600"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {index + 1}. {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* TAB 1: KHU VỰC */}
            {activeTab === "khuvuc" && (
              <div className="space-y-6">
                <Location onLocationSelect={handleLocationSelect} />
                <div>
                  <label className="block font-medium mb-2">Loại cho thuê</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Chọn loại cho thuê</option>
                    {RENTAL_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* TAB 2: THÔNG TIN MÔ TẢ */}
            {activeTab === "thongtinmota" && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Tiêu đề tin đăng"
                  className="w-full px-4 py-3 border rounded-lg text-lg font-medium"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Giá thuê (VNĐ)"
                    className="px-4 py-3 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Diện tích (m²)"
                    className="px-4 py-3 border rounded-lg"
                    required
                  />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Mô tả chi tiết..."
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
                <div>
                  <p className="font-medium mb-3">Tiện ích</p>
                  <div className="grid grid-cols-2 gap-3">
                    {FEATURES.map(f => (
                      <label key={f.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features.includes(f.id)}
                          onChange={() => handleFeatureToggle(f.id)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <span>{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HÌNH ẢNH */}
            {activeTab === "hinhanh" && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    <Upload className="w-5 h-5" />
                    Chọn ảnh (tối đa 10)
                  </label>
                  <p className="text-sm text-gray-600 mt-2">
                    Đã chọn: {images.length} ảnh
                  </p>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center gap-3 text-orange-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Đang upload ảnh lên S3...</span>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: THÔNG TIN LIÊN HỆ */}
            {activeTab === "thongtinlienhe" && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Thông tin người đăng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2">Họ tên</label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NÚT ĐIỀU HƯỚNG */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 py-4 bg-gray-200 font-bold rounded-lg hover:bg-gray-300"
              >
                Hủy bỏ
              </button>
              <button
                type={isLastTab ? "submit" : "button"}
                onClick={isLastTab ? undefined : goToNextTab}
                disabled={uploading}
                className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {uploading ? "Đang xử lý..." : isLastTab ? "Đăng tin ngay" : "Tiếp tục →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}