export const AMENITIES = [
  { key: "wifi", label: "Wifi" },
  { key: "wc", label: "WC riêng" },
  { key: "airCon", label: "Máy lạnh" },
  { key: "parking", label: "Chỗ để xe" },
  { key: "kitchen", label: "Bếp" },
]

export const MOCK_ROOMS = [
  {
    id: "r1",
    title: "Phòng trọ mới Quận 1",
    address: "Quận 1, TP.HCM",
    price: 5000000,
    area: 25,
    amenities: ["wifi", "airCon", "kitchen"],
    landlordId: "phuhuynh.010104@gmail.com",
    description: "Gần chợ Bến Thành, có ban công.",
    imageUrl: "https://placehold.co/400x300/F06060/ffffff?text=Q1",
  },
  {
    id: "r2",
    title: "Studio giá rẻ gần ĐH Sài Gòn",
    address: "Quận 5, TP.HCM",
    price: 3200000,
    area: 18,
    amenities: ["wifi", "wc", "parking"],
    landlordId: "phuhuynh.010104@gmail.com",
    description: "Phù hợp sinh viên, khu vực an ninh.",
    imageUrl: "https://placehold.co/400x300/3E92CC/ffffff?text=Q5",
  },
  {
    id: "r3",
    title: "Căn hộ mini Full nội thất",
    address: "Quận Bình Thạnh, TP.HCM",
    price: 7500000,
    area: 35,
    amenities: ["wifi", "wc", "airCon", "parking", "kitchen"],
    landlordId: "phuhuynh.010104@gmail.com",
    description: "View Landmark 81, có bảo vệ 24/7.",
    imageUrl: "https://placehold.co/400x300/4CAF50/ffffff?text=BinhThanh",
  },
  {
    id: "r4",
    title: "Phòng trọ Thủ Đức",
    address: "TP. Thủ Đức, TP.HCM",
    price: 2800000,
    area: 15,
    amenities: ["wifi", "parking"],
    landlordId: "L3",
    description: "Gần khu công nghệ cao, yên tĩnh.",
    imageUrl: "https://placehold.co/400x300/FFC107/333333?text=ThuDuc",
  },
  {
    id: "r5",
    title: "Phòng trọ Q10 tiện nghi",
    address: "Quận 10, TP.HCM",
    price: 4500000,
    area: 22,
    amenities: ["wifi", "wc", "airCon"],
    landlordId: "L2",
    description: "Gần bệnh viện, đi lại thuận tiện.",
    imageUrl: "https://placehold.co/400x300/9C27B0/ffffff?text=Q10",
  },
]

export const USER_ROLES = {
  STUDENT: "STUDENT",
  LANDLORD: "LANDLORD",
}

export const INITIAL_USER = {
  id: "U1",
  name: "Nguyễn Văn A (Sinh viên)",
}
