"use client";

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { ArrowLeft, ImageIcon, Video, Phone } from "lucide-react"
import Location from "../../components/Location"
import { toast } from "react-toastify";
import { useUser } from "../Store/UserContext";



const RENTAL_TYPES = [
	{ id: "phong_tro", name: "Cho thuê phòng trọ" },
	{ id: "nha_nguyen_can", name: "Cho thuê nhà" },
	{ id: "mat_bang", name: "Cho thuê mặt bằng" },
	{ id: "can_ho_mini", name: "Cho thuê căn hộ mini" },
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
	const { user } = useUser();

	const [isLastTab, setIsLastTab] = useState(false)
	const [currentTabIndex, setCurrentTabIndex] = useState(0)
	const [formData, setFormData] = useState({
		category: "",
		title: "",
		district: "",
		ward: "",
		address: "",
		price: "",
		priceUnit: "0",
		area: "",
		features: [],
		description: "",
		contactName: "",
		imageUrl: [],
		videoUrl: [],
		videos: [],
		contactPhone: "",
	})

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
		switch (activeTab) {
			case "khuvuc":
				if (!formData.district || !formData.ward || !formData.street || !formData.category) {
					console.log("Form data in khu vuc:", formData)
					toast("Vui lòng điền đầy đủ thông tin khu vực.", { type: "error" })
					return
				}
				break
			case "thongtinmota":
				if (!formData.title || !formData.price || !formData.area || !formData.description) {
					toast("Vui lòng điền đầy đủ thông tin mô tả.", { type: "error" })
					return
				}
				break
			case "hinhanh":
				if (formData.imageUrl.length === 0) {
					toast("Vui lòng tải lên ít nhất một hình ảnh.", { type: "error" })
					return
				}
				break
			case "video":
				// Video is optional
				break
			case "thongtinlienhe":
				if (!formData.contactName || !formData.contactPhone) {
					toast("Vui lòng điền đầy đủ thông tin liên hệ.", { type: "error" })
					return
				}
				break
		}
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

	const handleValidateForm = () => {
		if (!formData.district || !formData.ward || !formData.street || !formData.category) {
			toast("Vui lòng điền đầy đủ thông tin khu vực.", { type: "error" })
			return false
		}
		if (!formData.title || !formData.price || !formData.area || !formData.description) {
			toast("Vui lòng điền đầy đủ thông tin mô tả.", { type: "error" })
			return false
		}
		if (formData.imageUrl.length === 0) {
			toast("Vui lòng tải lên ít nhất một hình ảnh.", { type: "error" })
			return false
		}
		if (!formData.contactName || !formData.contactPhone) {
			toast("Vui lòng điền đầy đủ thông tin liên hệ.", { type: "error" })
			return false
		}
		return true
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!handleValidateForm()) return
		const dataToSubmit = {}
		if (formData.category == 1) {
			dataToSubmit.rental_type = "Phòng trọ, nhà trọ"
		}
		else if (formData.category == 2) {
			dataToSubmit.rental_type = "Nhà thuê nguyên căn"
		}
		else if (formData.category == 3) {
			dataToSubmit.rental_type = "Căn hộ"
		}
		dataToSubmit.title = formData.title
		dataToSubmit.address = `${formData.street}, ${formData.ward}, ${formData.district}`
		dataToSubmit.price = formData.price
		dataToSubmit.area = formData.area
		dataToSubmit.amenities = formData.features
		dataToSubmit.description = formData.description
		dataToSubmit.imageUrl = formData.imageUrl
		dataToSubmit.location = { lat: formData.locationCoords[1], lng: formData.locationCoords[0] }
		dataToSubmit.landlordId = user.id
		// Gửi dữ liệu đến backend
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(dataToSubmit),
		})
		if (!res.ok) {
			toast("Đăng tin thất bại. Vui lòng thử lại.", { type: "error" })
			return
		}
		toast("Đăng tin thành công!", { type: "success" })
		console.log("Form data:", formData)
	}

	const handleImageUpload = (e) => {
		const files = e.target.files
		if (!files) return

		Array.from(files).forEach((file) => {
			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				alert("Ảnh không được vượt quá 10MB")
				return
			}

			// Validate file type
			if (!file.type.startsWith("image/")) {
				alert("Chỉ chấp nhận file ảnh")
				return
			}

			// Validate max 20 images
			if (formData.imageUrl.length >= 20) {
				alert("Tối đa 20 ảnh")
				return
			}

			// Create preview URL
			const reader = new FileReader()
			reader.onload = (event) => {
				const imageUrl = event.target?.result?.toString()
				setFormData((prev) => ({
					...prev,
					imageUrl: [...prev.imageUrl, imageUrl],
				}))
			}
			reader.readAsDataURL(file)
		})
	}

	const handleRemoveImage = (index) => {
		setFormData((prev) => ({
			...prev,
			imageUrl: prev.imageUrl.filter((_, i) => i !== index),
		}))
	}

	const handleVideoLinkChange = (e) => {
		setFormData((prev) => ({
			...prev,
			videoLink: e.target.value,
		}))
	}
	const handleVideoUpload = (e) => {
		const files = e.target.files
		if (!files) return

		Array.from(files).forEach((file) => {
			// Validate file type
			if (!file.type.startsWith("video/")) {
				alert("Chỉ chấp nhận file video")
				return
			}

			// Create preview URL
			const reader = new FileReader()
			reader.onload = (event) => {
				const videoUrl = event.target?.result?.toString()
				setFormData((prev) => ({
					...prev,
					videos: [...prev.videos, videoUrl],
				}))
			}
			reader.readAsDataURL(file)
		})
	}


	const handleRemoveVideo = (index) => {
		setFormData((prev) => ({
			...prev,
			videos: prev.videos.filter((_, i) => i !== index),
		}))
	}


	return (
		<div className="min-h-screen bg-gray-50">
			{/* Sticky Header */}
			<div className="sticky top-14 z-30 bg-white shadow-sm border-b">
				<div className="max-w-full px-4 lg:px-8">
					<div className="flex items-center justify-between py-2 mb-2">
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
									className={`py-2 px-1 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === tab.id
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
			<div className="max-w-full px-2 lg:px-4 py-4">
				<div className="grid lg:grid-cols-4 gap-4">
					{/* Sidebar - Desktop Only */}
					<div className="hidden lg:block lg:col-span-1">
						<div className="bg-white rounded-lg shadow-md p-6 sticky top-45">
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
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* SECTION 1: KHU VỰC */}
							{activeTab === "khuvuc" && (
								<div className="space-y-4">
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
									<Location
										formData={formData}
										setFormData={setFormData}
										handleChange={handleChange}
									/>
								</div>
							)}

							{/* SECTION 2: THÔNG TIN MÔ TẢ */}
							{activeTab === "thongtinmota" && (
								<div className="space-y-4">
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
														{/* <option value="1">đồng/m²/tháng</option> */}
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
										<h3 className="text-lg font-bold text-gray-800 mb-4">Tiện ích</h3>
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
								<div className="space-y-4">
									<div className="bg-white rounded-lg shadow-md p-6">
										<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
											<ImageIcon className="w-5 h-5 mr-2" />
											Hình ảnh
										</h3>

										{/* Image Upload UI */}
										<div className="mb-6">
											<label className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
												<input
													type="file"
													multiple
													accept="image/*"
													onChange={handleImageUpload}
													className="hidden"
													disabled={formData.imageUrl.length >= 20}
												/>
												<p className="text-gray-600 font-medium mb-2">Tải ảnh từ thiết bị</p>
												<p className="text-xs text-gray-500">Tối đa 20 ảnh, dung lượng tối đa 10MB/ảnh</p>
											</label>
										</div>

										{/* Image Preview Grid */}
										{formData.imageUrl.length > 0 && (
											<div>
												<p className="text-sm font-medium text-gray-700 mb-3">
													Hình ảnh đã tải ({formData.imageUrl.length}/20)
												</p>
												<div className="grid grid-cols-3 gap-4">
													{formData.imageUrl.map((imageUrl, index) => (
														<div key={index} className="relative group">
															<img
																src={imageUrl || "/placeholder.svg"}
																alt={`Preview ${index + 1}`}
																className="w-full h-32 object-cover rounded-lg"
															/>
															<button
																type="button"
																onClick={() => handleRemoveImage(index)}
																className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
															>
																×
															</button>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							)}


							{/* SECTION 4: VIDEO */}
							{activeTab === "video" && (
								<div className="space-y-4">
									<div className="bg-white rounded-lg shadow-md p-6">
										<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
											<Video className="w-5 h-5 mr-2" />
											Video
										</h3>

										{/* Video Link Input */}
										<div className="mb-6">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Video Link (Youtube/Tiktok)
											</label>
											<input
												type="text"
												value={formData.videoLink}
												onChange={handleVideoLinkChange}
												placeholder="https://www.youtube.com/watch?v=..."
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											/>
										</div>

										{/* Video Upload UI */}
										<div>
											<label className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
												<input type="file" multiple accept="video/*" onChange={handleVideoUpload} className="hidden" />
												<p className="text-gray-600 font-medium mb-2">Tải Video từ thiết bị</p>
												<p className="text-xs text-gray-500">Hỗ trợ mp4, avi, mov, v.v.</p>
											</label>
										</div>

										{/* Video Preview */}
										{formData.videos.length > 0 && (
											<div className="mt-6">
												<p className="text-sm font-medium text-gray-700 mb-3">
													Video đã tải ({formData.videos.length})
												</p>
												<div className="space-y-4">
													{formData.videos.map((videoUrl, index) => (
														<div key={index} className="relative">
															<video src={videoUrl} controls className="w-full h-48 bg-black rounded-lg" />
															<button
																type="button"
																onClick={() => handleRemoveVideo(index)}
																className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
															>
																×
															</button>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							)}

							{/* SECTION 5: THÔNG TIN LIÊN HỆ */}
							{activeTab === "thongtinlienhe" && (
								<div className="space-y-4">
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
