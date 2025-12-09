"use client";

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { ArrowLeft, ImageIcon, Video, Phone } from "lucide-react"
import Location from "../../components/Location"
import { toast } from "react-toastify";
import { useUser } from "../Store/UserContext";

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
]


export default function PostPage() {
	const [activeTab, setActiveTab] = useState("khuvuc")
	const { user } = useUser();

	const [isLastTab, setIsLastTab] = useState(false)
	const [currentTabIndex, setCurrentTabIndex] = useState(0)
	const [formData, setFormData] = useState({
		id: "",
		title: "",
		district: "",
		ward: "",
		street: "",
		address: "",
		// category: "",
		price: "",
		priceUnit: "0",
		area: "",
		amenities: [],
		description: "",
		contact_name: "",
		contact_phone: "",

		images: [],
		// videoLink: "",
		// videos: [],

		location: { lat: null, lng: null },
	})


	const tabs = [
		{ id: "khuvuc", label: "Khu vực" },
		{ id: "thongtinmota", label: "Thông tin mô tả" },
		{ id: "hinhanh", label: "Hình ảnh" },
		// { id: "video", label: "Video" },
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
				if (!formData.district || !formData.ward || !formData.street) {
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
				if (formData.images.length === 0) {
					toast("Vui lòng tải lên ít nhất một hình ảnh.", { type: "error" })
					return
				}
				break
			case "video":
				// Video is optional
				break
			case "thongtinlienhe":
				if (!user?.name || !formData.contact_phone) {
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
			amenities: prev.amenities.includes(id) ? prev.amenities.filter((f) => f !== id) : [...prev.amenities, id],
		}))
	}

	const handleValidateForm = () => {
		if (!formData.district || !formData.ward || !formData.street) {
			toast("Vui lòng điền đầy đủ thông tin khu vực.", { type: "error" })
			return false
		}
		if (!formData.title || !formData.price || !formData.area || !formData.description) {
			toast("Vui lòng điền đầy đủ thông tin mô tả.", { type: "error" })
			return false
		}
		if (formData.images.length === 0) {
			toast("Vui lòng tải lên ít nhất một hình ảnh.", { type: "error" })
			return false
		}
		if (!user?.name || !formData.contact_phone) {
			toast("Vui lòng điền đầy đủ thông tin liên hệ.", { type: "error" })
			return false
		}
		return true
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!handleValidateForm()) return

		const dataToSubmit = {
			title: formData.title,
			description: formData.description,
			price: Number(formData.price),
			area: Number(formData.area),

			address: `${formData.street}, ${formData.ward}, ${formData.district}`,
			district: formData.district,
			ward: formData.ward,

			location: {
				lat: formData.location.lat,
				lng: formData.location.lng,
			},

			images: formData.images,
			// videoLink: formData.videoLink,
			// videos: formData.videos,

			amenities: formData.amenities,
			// rental_type: formData.category,

			contact_name: user?.name,
			contact_phone: formData.contact_phone,


			landlordId: user.id,
			date: new Date().toLocaleString("vi-VN"),
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(dataToSubmit),
			})

			if (!res.ok) {
				const err = await res.text()
				console.error("SERVER ERROR:", err)
				toast("Đăng tin thất bại. Vui lòng thử lại.", { type: "error" })
				return
			}

			toast("Đăng tin thành công!", { type: "success" })
			console.log("FORM SUBMIT:", dataToSubmit)

		} catch (error) {
			console.error("NETWORK ERROR:", error)
			toast("Không thể kết nối đến server!", { type: "error" })
		}
	}


	const handleImageUpload = (e) => {
		const files = e.target.files
		if (!files) return

		Array.from(files).forEach((file) => {
			// ✅ Giới hạn 2MB
			if (file.size > 2 * 1024 * 1024) {
				alert("Ảnh không được vượt quá 2MB")
				return
			}

			// ✅ Chỉ cho phép image
			if (!file.type.startsWith("image/")) {
				alert("Chỉ chấp nhận file ảnh")
				return
			}

			// ✅ Tối đa 20 ảnh
			if (formData.images.length >= 20) {
				alert("Tối đa 20 ảnh")
				return
			}

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, file], //  LƯU FILE, KHÔNG PHẢI BASE64
			}))
		})
	}


	const handleRemoveImage = (index) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
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

									{/* AMENITIES */}
									<div className="bg-white rounded-lg shadow-md p-6">
										<h3 className="text-lg font-bold text-gray-800 mb-4">Tiện ích</h3>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
											{AMENITIES.map((amenities) => (
												<label key={amenities.key} className="flex items-center space-x-2 cursor-pointer">
													<input
														type="checkbox"
														checked={formData.amenities.includes(amenities.key)}
														onChange={() => handleFeatureToggle(amenities.key)}
														className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
													/>
													<span className="text-sm text-gray-700">{amenities.label}</span>
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
													disabled={formData.images.length >= 20}
												/>
												<p className="text-gray-600 font-medium mb-2">Tải ảnh từ thiết bị</p>
												<p className="text-xs text-gray-500">Tối đa 20 ảnh, dung lượng tối đa 10MB/ảnh</p>
											</label>
										</div>

										{/* Image Preview Grid */}
										{formData.images.length > 0 && (
											<div>
												<p className="text-sm font-medium text-gray-700 mb-3">
													Hình ảnh đã tải ({formData.images.length}/20)
												</p>
												<div className="grid grid-cols-3 gap-4">
													{formData.images.map((images, index) => (
														<div key={index} className="relative group">
															<img
																src={images || "/placeholder.svg"}
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
													name="contact_name"
													value={user?.name}
													onChange={handleChange}
													placeholder="Họ và tên"
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
												<input
													type="tel"
													name="contact_phone"
													value={formData.contact_phone}
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
