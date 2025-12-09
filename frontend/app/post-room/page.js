"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Location from "../../components/Location";
import { toast } from "react-toastify";
import { useUser } from "../Store/UserContext";

const AMENITIES = [
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

export default function PostPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("khuvuc");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    area: "",
    address: "",
    description: "",
    amenities: [],
    contactName: user?.name || "",
    contactPhone: user?.phone || "",
    location: null,
  });

  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Preview URLs

  const tabs = ["khuvuc", "thongtinmota", "hinhanh", "thongtinlienhe"];
  const currentIndex = tabs.indexOf(activeTab);
  const isLastTab = currentIndex === tabs.length - 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter(k => k !== key)
        : [...prev.amenities, key],
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
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
      if (!res.ok) throw new Error(data.error || "Upload thất bại");
      toast.success("Upload ảnh thành công!");
      return data.urls;
    } catch (err) {
      toast.error("Lỗi upload ảnh: " + err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.area || !formData.address || !formData.location) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }

    try {
      const imageUrls = await uploadImages();

      const payload = {
        title: formData.title,
        price: Number(formData.price),
        area: Number(formData.area),
        address: formData.address,
        description: formData.description,
        amenities: formData.amenities,
        landlordId: user?.id || "unknown",
        imageUrl: imageUrls,
        location: formData.location,
      };

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Đăng tin thất bại");
      toast.success("Đăng tin thành công!");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra");
    }
  };

  const nextTab = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 text-center">
            <h1 className="text-3xl font-bold">Đăng tin cho thuê phòng trọ</h1>
          </div>

          <div className="flex border-b">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-medium transition ${
                  activeTab === tab
                    ? "border-b-4 border-orange-500 text-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {i + 1}. {tab === "khuvuc" ? "Khu vực" : tab === "thongtinmota" ? "Mô tả" : tab === "hinhanh" ? "Hình ảnh" : "Liên hệ"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* TAB 1: Khu vực */}
            {activeTab === "khuvuc" && <Location onLocationSelect={handleLocationSelect} />}

            {/* TAB 2: Thông tin mô tả */}
            {activeTab === "thongtinmota" && (
              <div className="space-y-6">
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Tiêu đề tin đăng" className="w-full px-4 py-3 border rounded-lg text-lg font-semibold" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Giá thuê (VNĐ)" className="px-4 py-3 border rounded-lg" required />
                  <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="Diện tích (m²)" className="px-4 py-3 border rounded-lg" required />
                </div>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ chi tiết (số nhà, đường...)" className="w-full px-4 py-3 border rounded-lg" required />
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Mô tả chi tiết phòng trọ..." className="w-full px-4 py-3 border rounded-lg" required />
                <div>
                  <p className="font-semibold mb-3">Tiện ích</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES.map(a => (
                      <label key={a.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.amenities.includes(a.key)} onChange={() => handleAmenityToggle(a.key)} className="w-5 h-5 text-orange-500" />
                        <span>{a.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Hình ảnh */}
            {activeTab === "hinhanh" && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-orange-300 rounded-xl p-10 text-center">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="upload" />
                  <label htmlFor="upload" className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition text-lg font-medium">
                    <Upload className="w-6 h-6" /> Chọn ảnh phòng trọ (tối đa 10)
                  </label>
                  <p className="mt-3 text-gray-600">Đã chọn: {images.length} ảnh</p>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center gap-3 text-orange-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-lg">Đang upload ảnh lên S3...</span>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt="" className="w-full h-48 object-cover rounded-lg shadow-md" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                        >
                          <X className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Liên hệ */}
            {activeTab === "thongtinlienhe" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">Họ tên</label>
                  <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block font-medium mb-2">Số điện thoại</label>
                  <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-100" required />
                </div>
              </div>
            )}

            {/* Nút điều hướng */}
            <div className="flex gap-4 pt-8">
              <button type="button" onClick={() => window.history.back()} className="flex-1 py-4 bg-gray-300 font-bold rounded-xl hover:bg-gray-400 transition">
                Hủy bỏ
              </button>
              <button
                type={isLastTab ? "submit" : "button"}
                onClick={isLastTab ? undefined : nextTab}
                disabled={uploading}
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50"
              >
                {uploading ? "Đang xử lý..." : isLastTab ? "HOÀN TẤT ĐĂNG TIN" : "Tiếp tục →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}